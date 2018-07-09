import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

import {MainPage} from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {SignupPage} from "../signup/signup";
import {SettingsPage} from "../settings/settings";
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
  wrongPasswordString: string = null;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth: AuthProvider,
              public _deeplinks: Deeplinks) {

    this.translateService.get(['LOGIN_ERROR', 'EMAIL', 'WRONG_PASSWORD', 'PASSWORD']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.wrongPasswordString = value.WRONG_PASSWORD;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
    });

    this._auth.isLoggedIn().then(loggedIn => {
        if (loggedIn) {
          navCtrl.setRoot(MainPage);
        }
      }
    );

    this._deeplinks.route({
      '/profile/:profileId': 'SettingsPage',
      '/savood/:offeringId': 'OfferingDetailPage',
      '/': {}
    }).subscribe(
      (match) => {
        if (this._auth.isLoggedIn()) {
          navCtrl.push(match.$route, match.$args);
        }
      },
      (nomatch) => {
        if (nomatch !== 'cordova_not_available') {
          if (nomatch.$route.length() > 0) {
            let toast = this.toastCtrl.create({
              message: "RESSOURCE_NOT_AVAILABLE",
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      }
    )

  }

  // Attempt to login in through our User service
  doLogin() {
    this._auth.login(this.account.email, this.account.password).subscribe(token => {
      this._auth.saveToken(token);
      this.navCtrl.setRoot(MainPage);
    }, err => {
      if (err.error.short_error == "WRONG_PASSWORD") {
        let toast = this.toastCtrl.create({
          message: this.wrongPasswordString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      } else {
        console.log("Error:", err);
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    })
  }

  forgotPassword() {
    this.navCtrl.push("ForgotPasswortPage", {email: this.account.email});
  }

  doRegister() {
    this.navCtrl.push("SignupPage");
  }
}
