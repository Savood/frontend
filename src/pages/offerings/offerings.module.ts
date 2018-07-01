import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OfferingsPage } from './offerings';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    OfferingsPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferingsPage),
    TranslateModule.forChild(),
    MomentModule
  ],
  exports: [
    OfferingsPage
  ]
})
export class OfferingsPageModule { }
