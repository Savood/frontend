import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferingMapPage } from './offering-map';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    OfferingMapPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferingMapPage),
    TranslateModule.forChild(),
  ],
})
export class OfferingMapPageModule {}
