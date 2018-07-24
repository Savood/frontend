import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import {Config, Nav, Platform, ToastController} from 'ionic-angular';
import {FirstRunPage, MainPage} from '../pages';
import {AuthProvider} from "../providers/auth/auth";
import {Deeplinks} from "@ionic-native/deeplinks";


@Component({
  template: `
    <ion-nav #content></ion-nav>`
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  constructor(private translate: TranslateService,
              platform: Platform,
              private config: Config,
              private splashScreen: SplashScreen,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth: AuthProvider,
              public _deeplinks: Deeplinks) {
    platform.ready().then(() => {
      this.splashScreen.hide();

      if (this._auth.isLoggedIn()) {
        this.nav.setRoot(MainPage);
      } else {
        this._auth.renewToken().then(data => {
          if (data && this._auth.isLoggedIn()) {
            this.nav.setRoot(MainPage);
          } else {
            this.nav.setRoot(FirstRunPage);
          }
        });
      }

      this._deeplinks.route({
        '/profile/:profileId': 'SettingsPage',
        '/savood/:offeringId': 'OfferingDetailPage',
        '/': {}
      }).subscribe(
        (match) => {
          if (this._auth.isLoggedIn()) {
            this.nav.push(match.$route, match.$args);
          }
        },
        (nomatch) => {
          if (nomatch !== 'cordova_not_available') {
            let toast = this.toastCtrl.create({
              message: "RESSOURCE_NOT_AVAILABLE",
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      )
    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang === 'de' || browserLang === 'eo') {
      this.translate.use(this.translate.getBrowserLang());
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }
}
