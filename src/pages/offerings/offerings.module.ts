import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OfferingsPage } from './offerings';

@NgModule({
  declarations: [
    OfferingsPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferingsPage),
    TranslateModule.forChild()
  ],
  exports: [
    OfferingsPage
  ]
})
export class OfferingsPageModule { }
