import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ChatOverviewPage } from './chat-overview';

@NgModule({
  declarations: [
    ChatOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatOverviewPage),
    TranslateModule.forChild()
  ],
  exports: [
    ChatOverviewPage
  ]
})
export class ChatOverviewModule { }
