import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {SignupPage} from "../signup/signup";

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
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public _auth:AuthProvider) {

    this.translateService.get(['LOGIN_ERROR','EMAIL','WRONG_PASSWORD','PASSWORD']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.wrongPasswordString= value.WRONG_PASSWORD;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
    });

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
      if(err.error.short_error == "WRONG_PASSWORD"){
        let toast = this.toastCtrl.create({
          message: this.wrongPasswordString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else {
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

  forgotPassword(){
    this.navCtrl.push("ForgotPasswortPage", {email: this.account.email});
  }

  doRegister(){
    this.navCtrl.push("SignupPage");
  }
}
