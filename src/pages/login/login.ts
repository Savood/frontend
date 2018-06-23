import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {TabsPage} from "../tabs/tabs";

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
    public _auth:AuthProvider) {

    this.translateService.get(['LOGIN_ERROR','EMAIL','PASSWORD']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
    })

    if(this._auth.isLoggedIn()){
      navCtrl.setRoot(MainPage);
    }
  }


  // Attempt to login in through our User service
  doLogin() {
    this._auth.login(this.account.email, this.account.password).subscribe(token=> {
      this._auth.saveToken(token);
      this.navCtrl.setRoot(MainPage);
    }, err =>{
      let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
    })
  }
}
