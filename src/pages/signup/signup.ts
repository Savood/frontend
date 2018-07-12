import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

import {User} from '../../providers';
import {MainPage} from '../';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../providers/api/users.service";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  account: { user: string, email: string, password: string } = {
    user: null,
    email: null,
    password: null
  };

  form: FormGroup;

  errormessage: string = null;

  valid: boolean = false;

  registerErrorString = null;
  successfulRegister = null;
  emailPlaceholder: string = null;
  passwordPlaceholder: string = null;
  passwordRepeatPlaceholder: string = null;

  email_required = null;
  email_email = null;
  conf_password_required = null;
  conf_password_areEqual = null;
  password_required = null;
  password_minLen = null;
  already_in_use = null;


  constructor(public navCtrl: NavController,
              public user: UsersService,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public _auth: AuthProvider,
              public formBuilder: FormBuilder
  ) {

    console.log("Actually I tried");

    this.translateService.get(['REGISTER_ERROR', 'EMAILREQ', 'EMAILINVALID', 'CONFIRMPASS', 'AREEQUAL', 'PASSREQ', 'PASSMINLEN', 'PASSWORDREPEAT', 'SUCCESSFUL_REGISTER', 'LOGIN_ERROR', 'EMAIL', 'ALREADY_IN_USE', 'PASSWORD']).subscribe((value) => {
      this.registerErrorString = value.REGISTER_ERROR;
      this.successfulRegister = value.SUCCESSFUL_REGISTER;
      this.emailPlaceholder = value.EMAIL;
      this.passwordPlaceholder = value.PASSWORD;
      this.passwordRepeatPlaceholder = value.PASSWORDREPEAT;

      this.email_required = value.EMAILREQ;
      this.email_email = value.EMAILINVALID;
      this.conf_password_required = value.CONFIRMPASS;
      this.conf_password_areEqual = value.AREEQUAL;
      this.password_required = value.PASSREQ;
      this.password_minLen = value.PASSMINLEN;
      this.already_in_use = value.ALREADY_IN_USE;

    });

    if (this._auth.isLoggedIn()) {
      navCtrl.setRoot(MainPage);
    }

    this.form = formBuilder.group({
      password: ['', [Validators.minLength(4), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password_repeat: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {

      this.makeErrorMessages();

      if (this.form.controls.password.value == this.form.controls.password_repeat.value) {
        this.valid = this.form.valid;
      } else {
        this.valid = false;
      }
    });
  }

  makeErrorMessages() {
    let form = this.form;

    if (form.controls['email'].hasError('required')) {
      this.errormessage = this.email_required;
    } else if (form.controls['email'].hasError('email')) {
      this.errormessage = this.email_email;
    } else if (form.controls['password'].hasError('required')) {
      this.errormessage = this.password_required;
    } else if (form.controls['password'].hasError('minLength')) {
      this.errormessage = this.password_minLen;
    } else if (form.controls['password_repeat'].hasError('required')) {
      this.errormessage = this.conf_password_required;
    } else if (this.form.controls.password.value != this.form.controls.password_repeat.value) {
      this.errormessage = this.conf_password_areEqual;
    } else {
      this.errormessage = null;
    }
  }

  doRegister() {

    let email = this.form.controls.email.value;
    let password = this.form.controls.password.value;

    this._auth.register(email, password).subscribe((data: { success: string, short_error: string }) => {
        if (data.success) {
          let toast = this.toastCtrl.create({
            message: this.successfulRegister,
            duration: 3000,
            position: 'top'
          });
          toast.present();

          this.navCtrl.pop();
        } else if (data.short_error && data.short_error == "ALREADY_IN_USE") {
          let toast = this.toastCtrl.create({
            message: this.already_in_use,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }

      },
      () => {
        let toast = this.toastCtrl.create({
          message: this.registerErrorString,
          duration: 3000,
          position: 'top'
        });

        toast.present();
      })
  }
}
