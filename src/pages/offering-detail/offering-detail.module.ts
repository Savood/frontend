import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OfferingDetailPage } from './offering-detail';
import {IonicImageViewerModule} from "ionic-img-viewer";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    OfferingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferingDetailPage),
    TranslateModule.forChild(),
    IonicImageViewerModule,
    MomentModule

  ],
  exports: [
    OfferingDetailPage
  ]
})
export class OfferingDetailPageModule { }
