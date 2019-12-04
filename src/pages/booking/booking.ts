import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { google } from 'google-maps';
import { ConnectedPage } from '../connected/connected';


declare var google : google;

@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  key: any;
  taxi: any;
  booking: any;
  sourcePlace:any;
  destinationPlace:any;
  status: any;
  price: any;
  duration:any;
  distance:any


  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public firebase: AngularFireDatabase,
  	public firebasePrvd: FirebaseProvider,
  	public alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
  	  this.key = this.navParams.get('key');
	  this.firebasePrvd.getById('booking',this.key).subscribe((booking:any)=>{
        this.booking = booking;
	  		this.firebasePrvd.getById('taxi',booking.taxi).subscribe((taxi:any)=>{
	  			this.taxi = taxi;

	  			let source = booking.source;
	  			this.getPlace(source).then((sourcePlace)=>{
	  				this.sourcePlace = sourcePlace;
	  			});

	  			let destination = taxi.coords;
	  			this.getPlace(destination).then((destinationPlace)=>{
	  				this.destinationPlace = destinationPlace
	  			});

	  			let status = booking.status;

	  			switch (status) {
	  				case 0:
	  					this.status = "En attente de validation";
	  					break;
	  				case 1:
	  					this.status = "Valider";
	  					break;
	  				case 2:
	  					this.status = "Confirmer";

	  					this.getTravelDetails(source,destination).then((details:any)=>{
	  						this.distance = details.distance
          					this.duration = details.duration
	  					})
	  					break;
	  				case 3:
	  					this.status = "Réservation Passé";
	  					break;
	  				case 4:
	  					this.status = "Réservation Annulé";
	  					break;
	  			}

	  			if (booking.price) {
	  				this.price = booking.price;
	  			}



	  		})
	  });

  }

  getPlace(position){
  	return new Promise((resolve)=>{
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
	          let place = results[0].formatted_address;
	          resolve(place);
	        }
	      } 
	    });
  	})

  }

  cancelBooking(){
  	let alert = this.alertCtrl.create({
          title : 'Annuler',
          message: 'Voulez-vous annuler cette réservation?',
          buttons: [
            {
                text: 'OUI',
                handler: () => {
                    let pikla = {
        				      status: 0,
        				    };
        				    this.firebasePrvd.save('taxi',pikla,this.booking.taxi);
        				  	this.firebasePrvd.delete('booking',this.key);

                    this.navCtrl.setRoot(ConnectedPage);
                }
            },
            {
                text: 'NON',
                handler: () => {
                }
            },
          ],
          enableBackdropDismiss: false,
      });
      
      alert.present();
  	
  }

  confirmBooking(){

  	let alert = this.alertCtrl.create({
          title : 'Confirmer',
          message: 'Voulez-vous confirmer cette réservation à ' + this.price + 'Ar',
          buttons: [
            {
                text: 'OUI',
                handler: () => {
                    let booking = {
				      status: 2,
				    };
				    this.firebasePrvd.save('booking',booking,this.key);
                }
            },
            {
                text: 'NON',
                handler: () => {
                }
            },
          ],
          enableBackdropDismiss: false,
      });
      
      alert.present();
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


}
