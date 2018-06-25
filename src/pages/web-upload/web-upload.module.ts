import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { WebUploadPage } from './web-upload';

@NgModule({
  declarations: [
    WebUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(WebUploadPage),
    TranslateModule.forChild()
  ],
  exports: [
    WebUploadPage
  ]
})
export class TabsPageModule { }
