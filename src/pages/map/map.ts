import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Address } from '../../classes/address.class';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker,Environment } from '@ionic-native/google-maps';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  
  target: Address;

  map: GoogleMap;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    private geolocation: Geolocation
  ) {
    
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
       this.loadMap(data);
    });
  }

  loadMap(position){
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: position,
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
  }

  ionViewDidLoad() {
  }

}
