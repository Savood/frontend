import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, ModalController, NavController, ToastController} from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  account: {user:string, email: string, password: string } = {
    user:null,
    email: null,
    password: null
  };


  registerErrorString = null;
  successfulRegister = null;
  namePlaceholder: string = null;
  emailPlaceholder: string = null;
  passwordPlaceholder: string = null;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth:AuthProvider) {

    this.translateService.get(['REGISTER_ERROR','SUCCESSFUL_REGISTER','USERNAME','LOGIN_ERROR','EMAIL','PASSWORD']).subscribe((value) => {
      this.registerErrorString = value.REGISTER_ERROR;
      this.successfulRegister = value.SUCCESSFUL_REGISTER;
      this.namePlaceholder = value.USERNAME;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
    })

    if(this._auth.isLoggedIn()){
      navCtrl.setRoot(MainPage);
    }

  }

  doRegister() {

    this._auth.register(this.account.email, this.account.user, this.account.password).subscribe((data:{success:string})=>
    {
      console.log(data);
      if(data.success) {
        let toast = this.toastCtrl.create({
          message: this.successfulRegister,
          duration: 3000,
          position: 'top'
        });
        toast.present();

        this.navCtrl.pop();
      }

    }, err =>{
      let toast = this.toastCtrl.create({
        message: this.registerErrorString,
        duration: 3000,
        position: 'top'
      });

      toast.present();
    })
  }
}
