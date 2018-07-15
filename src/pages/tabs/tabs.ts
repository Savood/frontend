import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import {Tab1Root, Tab2Root, Tab3Root, Tab4Root} from '../';
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";

  profileId = this._auth.getActiveUserId();

  constructor(public navCtrl: NavController, public translateService: TranslateService, public _auth: AuthProvider) {
    translateService.get(['TAB.TITLE1', 'TAB.TITLE2', 'TAB.TITLE3', 'TAB.TITLE4']).subscribe(values => {
      this.tab1Title = values['TAB.TITLE1'];
      this.tab2Title = values['TAB.TITLE2'];
      this.tab3Title = values['TAB.TITLE3'];
      this.tab4Title = values['TAB.TITLE4'];
    });
  }
}
