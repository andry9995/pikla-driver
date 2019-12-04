import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GoogleGeolocation } from '../../classes/google-geolocation.class';
import { Address } from '../../classes/address.class';
import { PiklaPage } from '../pikla/pikla';

import { google } from 'google-maps';


declare var google : google;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage extends GoogleGeolocation{

  form: FormGroup;
  target: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private formBuilder: FormBuilder,
  	public alertCtrl: AlertController,
    public platform:Platform,
   
  ) {

    super( alertCtrl, platform);

    this.form = this.formBuilder.group({
      // origin: ['',Validators.required],      
      target: ['',Validators.required], 

    });


    // let items = afs.collection('taxi').valueChanges((resp) => {
    //   console.log(resp);
    // });
    // this.items$ = this.itemsCollection.valueChanges({idField: 'id'});
  }

  ionViewDidLoad() {
    this.prepareAutocompletion();
  }

   prepareAutocompletion(){
      let input_location: any = this.autocomplete('#target input');
      input_location.setComponentRestrictions({'country': ['mg']});

      google.maps.event.addListener(input_location, 'place_changed', () => {
        let place = input_location.getPlace();
        this.target = place;
      });

  }

  onSubmit(){
  	this.navCtrl.setRoot(PiklaPage, {
      target: this.target
    });
  }

}
