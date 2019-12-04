import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading } from 'ionic-angular';
import { ConnectedPage } from '../connected/connected';
import { BookingPage } from '../booking/booking';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  private loading: Loading;

  constructor( 
    private navCtrl: NavController,
    public fb : Facebook,
    private loadingCtrl: LoadingController 
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){

    this.navCtrl.setRoot(ConnectedPage);
    // this.navCtrl.setRoot(BookingPage,{
    //   key: '-LvCJkSHxp50QD380Os8'
    // });
    
    // this.loading = this.loadingCtrl.create();
    // this.loading.present();

    // this.fb.login(['public_profile', 'user_friends', 'email'])
    
  }


}
