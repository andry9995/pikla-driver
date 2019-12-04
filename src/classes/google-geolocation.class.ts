import { AlertController, Platform, Events, ViewController } from 'ionic-angular';

import { Address } from '../classes/address.class';
 
declare var google;
export class GoogleGeolocation {
 
 
    constructor(public alertCtrl: AlertController, public platform: Platform) {
    }
 
    protected verifyGoogle() {
        return new Promise((resolve) => {
            if (typeof(google) == 'undefined') {
                let alert: {} = {
                    title : 'Erreur!',
                    subTitle: 'L\'API de Google Map n\'est pas fonctionnel',
                    message: 'Veuillez vérifier votre connexion avant de réessayer',
                    buttons: [
                    {
                        text: 'Réessayer',
                        handler: () => {
                            this.verifyGoogle();
                        }
                    },
                    {
                        text: 'Quitter',
                        handler: () => {
                            this.platform.exitApp();
                        }
                    },
                    ],
                    enableBackdropDismiss: false,
                }
 
                this.showAlert(alert);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }
 
    protected showAlert(alert) {
        this.alertCtrl.create(alert).present();
    }
 
    protected autocomplete(selector: string) {
        let input = <HTMLInputElement>document.querySelector(selector);
        return new google.maps.places.Autocomplete(input);
    }

    protected getAddress(place: any) {
        return new Address(place);
    }
 
}