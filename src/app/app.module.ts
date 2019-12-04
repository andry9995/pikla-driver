import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SearchPage } from '../pages/search/search';
import { ConnectedPage } from '../pages/connected/connected';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PiklaPage } from '../pages/pikla/pikla';
import { BookingPage } from '../pages/booking/booking';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FirebaseProvider } from '../providers/firebase/firebase';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MapPage,
    SearchPage,
    ConnectedPage,
    PiklaPage,
    BookingPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MapPage,
    SearchPage,
    ConnectedPage,
    PiklaPage,
    BookingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
