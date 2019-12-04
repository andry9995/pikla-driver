import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectedPage } from './connected';

@NgModule({
  declarations: [
    ConnectedPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectedPage),
  ],
})
export class ConnectedPageModule {}
