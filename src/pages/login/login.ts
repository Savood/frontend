import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, ModalController, NavController, ToastController} from 'ionic-angular';

import {User} from '../../providers';
import {MainPage} from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {SignupPage} from "../signup/signup";
import {SettingsPage} from "../settings/settings";
import {ChatOverviewPage} from "../chat-overview/chat-overview";
import {Deeplinks} from "@ionic-native/deeplinks";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: { email: string, password: string } = {
    email: null,
    password: null
  };

  emailPlaceholder: string = null;
  passwordPlaceholder: string = null;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth: AuthProvider, public modalCtrl: ModalController,
              private _deeplinks: Deeplinks) {

    this.translateService.get(['LOGIN_ERROR', 'EMAIL', 'PASSWORD']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
    })

    if (this._auth.isLoggedIn()) {
      navCtrl.setRoot(MainPage);
    }

    this._deeplinks.route({
      '/profile/:profileId': 'SettingsPage',
      '/': {}
    }).subscribe(
      (match) => {
        if (this._auth.isLoggedIn()) {
          navCtrl.push(match.$route,match.$args);
        }
      },
      (nomatch) => {
        let toast = this.toastCtrl.create({
          message: "RESSOURCE_NOT_AVAILABLE",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    )

  }

  // Attempt to login in through our User service
  doLogin() {
    this._auth.login(this.account.email, this.account.password).subscribe(token => {
      this._auth.saveToken(token);
      this.navCtrl.setRoot(MainPage);
    }, err => {
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  doRegister() {
    this.navCtrl.push("SignupPage");
  }
}
