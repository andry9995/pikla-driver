import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { SearchPage } from '../search/search';
import { PiklaPage } from '../pikla/pikla';
import { Facebook } from '@ionic-native/facebook/ngx';



@IonicPage()
@Component({
  selector: 'page-connected',
  templateUrl: 'connected.html',
})
export class ConnectedPage {

  public user: any = {
    name : 'Andry RAMANANARIVO',
    picture: 'assets/imgs/user.png'
  };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fb: Facebook
  ) {
  }

  ionViewDidLoad() {
    // this.getUser();
  }

  requestBooking(){
  	this.navCtrl.setRoot(PiklaPage);
  }

  getUser() {
    this.fb.api('me?fields=id,email,name,birthday,picture.width(720).height(720).as(picture_large),location', []).then((profile) => {
      this.user = {
        name: profile['name'],
        picture: profile['picture_large']['data']['url'],
      }
    })
  }

}
