import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, Slides, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {TranslateService} from "@ngx-translate/core";
import {Address} from "../../models/address";
import {UsersService} from "../../providers";
import {MainPage} from "../index";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;

  nameForm: FormGroup;

  address: Address = {};
  user: User = {};

  successfulCreateUser: string = null;

  loading = false;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public translateService: TranslateService,
              public _user: UsersService,
              public toastCtrl: ToastController) {

    this.nameForm = this.formBuilder.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
    });

    this.translateService.get(['CREATE_USER_SUCCESS']).subscribe((value) => {
      this.successfulCreateUser = value.CREATE_USER_SUCCESS;
    });

  }

  swipeToName() {
    this.slides.slideTo(2);
  }

  finishCreation() {

    this.user.address = this.address;
    this.user.firstname = this.nameForm.controls['firstname'].value;
    this.user.lastname = this.nameForm.controls['lastname'].value;
    this.loading = true;

    this._user.createNewUser(this.user).subscribe(
      () => {
        let toast = this.toastCtrl.create({
          message: this.successfulCreateUser,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(MainPage);

      },
      () => {
      },
      () => this.loading = false
    );

  }
}
