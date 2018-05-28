import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OfferingDetailPage } from './offering-detail';

@NgModule({
  declarations: [
    OfferingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferingDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    OfferingDetailPage
  ]
})
export class OfferingDetailPageModule { }
