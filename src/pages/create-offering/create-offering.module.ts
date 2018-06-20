import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOfferingPage } from './create-offering';

@NgModule({
  declarations: [
    CreateOfferingPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateOfferingPage),
  ],
})
export class CreateOfferingPageModule {}
