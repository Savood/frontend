import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferinglistPage } from './offeringlist';
import { TranslateModule } from '@ngx-translate/core';
import {MomentModule} from "angular2-moment";


@NgModule({
  declarations: [
    OfferinglistPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferinglistPage),
    TranslateModule.forChild(),
    MomentModule
  ],
})
export class OfferinglistPageModule {}
