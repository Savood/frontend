import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, ModalController, NavController, ToastController} from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  form: FormGroup;

  valid:boolean = false;

  registerErrorString = null;
  successfulRegister = null;
  namePlaceholder: string = null;
  emailPlaceholder: string = null;
  passwordPlaceholder: string = null;
  passwordRepeatPlaceholder: string= null;


  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth:AuthProvider,
              public formBuilder: FormBuilder) {

    this.translateService.get(['REGISTER_ERROR','PASSWORDREPEAT','SUCCESSFUL_REGISTER','USERNAME','LOGIN_ERROR','EMAIL','PASSWORD']).subscribe((value) => {
      this.registerErrorString = value.REGISTER_ERROR;
      this.successfulRegister = value.SUCCESSFUL_REGISTER;
      this.namePlaceholder = value.USERNAME;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
      this.passwordRepeatPlaceholder = value.PASSWORDREPEAT

    })

    if(this._auth.isLoggedIn()){
      navCtrl.setRoot(MainPage);
    }

    this.form = formBuilder.group({
      username: ['', [Validators.minLength(4),Validators.required]],
      password:['', [Validators.minLength(4), Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password_repeat:['', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      console.log(this.form.controls.password.value == this.form.controls.password_repeat.value);
      if(this.form.controls.password.value == this.form.controls.password_repeat.value) {
        this.valid = this.form.valid;
      }else{
        this.valid = false;
      }
    });

  }

  doRegister() {

    let email = this.form.controls.email.value;
    let username = this.form.controls.username.value;
    let password = this.form.controls.password.value;

    this._auth.register(email, username, password).subscribe((data:{success:string})=>
    {
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
