import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Events, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MyLocation, GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, MarkerIcon, LatLng } from '@ionic-native/google-maps';
import { google } from 'google-maps';
import { BookingPage } from '../booking/booking';
import { FirebaseProvider } from '../../providers/firebase/firebase';


declare var google : google;

@IonicPage()
@Component({
  selector: 'page-pikla',
  templateUrl: 'pikla.html',
})
export class PiklaPage {

  target : any;
  map: GoogleMap;
  directionsService = new google.maps.DirectionsService();
  selectedBooking:any;
  position:any;
  key: "74859"

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public firebasePrvd: FirebaseProvider
  ) {

  }

  ionViewDidLoad() {
    this.getCurentPosition().then((position)=>{
      this.position = position;
      this.initMap(position);
    })
  }

  ngOnInit() {

  }

  getCurentPosition(){
    return new Promise((resolve)=>{
      this.firebasePrvd.fetchById('taxi',"74859").then((taxi:any)=>{
        resolve(taxi.coords);
      })
    })
  }

  initMap(position){
  	this.loadMap(position)
  		.then((loaded)=>{
	  		if (loaded) {
	  			this.addMarker(position,"pikla");

          this.listRequester()



	  			// this.addMarker(this.target,"destination");
	  			// this.traceRoute(position,this.target).then((response:any) => {
	  			// 	this.addPolylines(response).then((target) => {
	  			// 		this.moveCamera(target);
	  			// 	})
	  			// })
	  		}
	  	})
	  	.then(() => {
        // this.firebasePrvd.fetchAll('taxi').then((data:any)=>{
        //   for(let key in data){
        //     let pikla  = data[key];
        //     let coords = new LatLng(pikla.coords.lat,pikla.coords.lng);
        //     if (pikla.status == 0) {
        //       this.addMarker(coords,"pikla",key);
        //     }
        //   }
        // })
	  	})
  }


  listRequester(){
    return new Promise((resolve)=>{
      this.firebasePrvd.fetchAll('booking').then((data:any)=>{
        for(let key in data){
          let booking = data[key];
          if((booking.taxi == "74859") && (booking.status == 0)) {
            let traveler = booking.source;
            let destination = booking.destination
            this.addMarker(traveler,"traveler",key);
            this.addMarker(destination,"destination");

            this.traceRoute(this.position,traveler).then((response:any)=>{
              this.addPolylines(response,'#212121').then((target)=>{

                this.traceRoute(traveler,destination).then((resp:any)=>{
                  this.addPolylines(resp,'#2196f3').then((tar)=>{
                    console.log('ok')
                  })
                })

              })
            })
          }
        }
      })
    })
  }

  traceTravel(traveler,destination){

    let travel = [
      this.position,
      traveler,
      destination
    ];

    let polyline = this.map.addPolyline({
      points: traveler,
      color: '#AA00FF',
      width: 10,
      geodesic: true,
    });

  }

  loadMap(position){
  	return new Promise((resolve) => {
  		let mapOptions: GoogleMapOptions = {
			camera: {
				target: position,
				zoom: 15,
				tilt: 30
			},
      mapType: 'MAP_TYPE_ROADMAP',
      controls: {
        compass: true,
          myLocationButton: true,
          myLocation: true,
          indoorPicker: true,
          mapToolbar: true
      }

		};


		this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.clear();

		this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
			resolve(true);
		})
  	})
  }

  addMarker(pos, type?:string,key?:string){

    let url = "";

    let title = "";

    switch (type) {
      case "traveler":
        url = './assets/icon/traveler.png';
        title = "Voyageur"
        break;
      case "destination":
        url = './assets/icon/pin-destination.png';
        title = "Déstination"
        break;
      case "pikla":
        url = './assets/icon/taxi.png';
        title = "Vous";


    }


    let icon : MarkerIcon = {
       url: url ,
       size: {
         width: 40,
         height: 40
       }
     }

  	let position = new LatLng(pos.lat,pos.lng);

  	let marker: MarkerOptions = {
  		position: {
  			lat: position.lat,
  			lng: position.lng
  		},
      icon:icon,
      title: title
  	}

	  this.map.addMarker(marker).then((markerObject)=>{
      if (type == "traveler") {
         markerObject.on(GoogleMapsEvent.MARKER_CLICK).subscribe((marker) => {
           console.log('click traveler')
           this.selectedBooking = key;
           this.clickPiklaMarker(marker);
         });
      }
    })

  }


   getTravelDetails(origin,destination){
     return new Promise((resolve)=>{
       var service = new google.maps.DistanceMatrixService();
       service.getDistanceMatrix(
       {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING
       },function(response,status) {
         let travelDetailsObject;
         if (status == 'OK') {
             var origins = response.originAddresses;
             var destinations = response.destinationAddresses;
             for (var i = 0; i < origins.length; i++) {
               var results = response.rows[i].elements;
               for (var j = 0; j < results.length; j++) {
                  var element = results[j];
                  var distance = element.distance.text;
                  var duration = element.duration.text;
                  var from = origins[i];
                  var to = destinations[j];
                  travelDetailsObject = {
                     distance: distance,
                     duration: duration
                  }
               }
             }
             resolve(travelDetailsObject);
         }
       });
     })
   }
  

  clickPiklaMarker(marker){

    // let marker: Marker = <Marker>params[1];


    this.firebasePrvd.fetchById('booking',this.selectedBooking).then((booking:any)=>{

      let origin = this.position;
      let destination = booking.source;

      this.getTravelDetails(origin,destination).then((details:any)=>{
        let distance = details.distance;
        let duration = details.duration;

        let alert = this.alertCtrl.create({
          title: 'Valider',
          message: 'Voulez vous valider cette réservation ? Le voyageur se trouve à ' + distance + ' de vous, soit ' + duration + 'de route',
          inputs: [
            {
              name: 'price',
              placeholder: 'Prix du trajet'
            }
          ],
          buttons: [
            {
              text: 'OUI',
              handler: data =>{
                this.bookTaxi(marker,data.price)
              }
            },
            {
              text: 'NON',
              handler: data => {

              }
            }
          ],
          cssClass: 'tb-alert',
          enableBackdropDismiss: false
        });

        alert.present()

      })
    })

  }

  bookTaxi(marker,price){

    let book = {
      status: 1,
      price: price
    };

    this.firebasePrvd.save('booking',book,this.selectedBooking)

  }

  traceRoute(origin,destination){
  	return new Promise((resolve)=>{
  		let request = {
  			origin: origin,
  			destination: destination,
  			unitSystem: google.maps.UnitSystem.METRIC,
			  travelMode: google.maps.TravelMode.DRIVING,
  		};

      let directionsService = new google.maps.DirectionsService();

  		directionsService.route(request, function(result, status){
			if (status == 'OK') {
        // var distance = result.routes[0].legs[0].distance.value;
        // var duree = result.routes[0].legs[0].duration.value;
        // console.log(distance,duree);
				resolve(result);
			}
		})
  	})
  }

  addPolylines(response:any,color){
  	return new Promise((resolve)=>{
  		let polilynes = [];
		response.routes[0].overview_path.forEach((position) => {
			let polilyne = { lat: position.lat(), lng: position.lng() }
			polilynes.push(polilyne);
		});

		let leg = response.routes[0].legs[0];
		let start = leg.start_location;
		let end = leg.end_location;
		let target = [{
			lat: start.lat(),
			lng: start.lng()
		}, {
			lat: end.lat(),
			lng: end.lng()
		}];

		this.map.addPolyline({
			points: polilynes,
			'color' : color,
			'width': 10,
			'geodesic': true,
		}).then(()=>{
			resolve(target);
		})

  	})
  }

  moveCamera(target){
	this.map.moveCamera({
		target: target,
		zoom: 15
	})
  }

  getPlace(position){
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    var latlng = {
      lat: position.lat, 
      lng: position.lng
    };

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          infowindow.setContent(results[0].formatted_address);
          console.log(results[0].formatted_address);
        }
      } 
    });



  }

}
