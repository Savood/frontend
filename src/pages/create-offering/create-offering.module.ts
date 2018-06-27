import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOfferingPage } from './create-offering';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    CreateOfferingPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateOfferingPage),
    TranslateModule
  ],
})
export class CreateOfferingPageModule {}
