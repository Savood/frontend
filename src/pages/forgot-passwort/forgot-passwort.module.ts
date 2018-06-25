import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswortPage } from './forgot-passwort';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ForgotPasswortPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswortPage),
    TranslateModule.forChild()
  ],
})
export class ForgotPasswortPageModule {}
