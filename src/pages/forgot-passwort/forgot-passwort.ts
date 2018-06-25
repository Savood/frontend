import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {AuthProvider} from "../../providers/auth/auth";
import {HttpErrorResponse} from "@angular/common/http";

/**
 * Generated class for the ForgotPasswortPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-passwort',
  templateUrl: 'forgot-passwort.html',

})
export class ForgotPasswortPage {

  email:string = "";

  reset_success:string = null;
  reset_fail:string = null;
  reset_no_user:string = null;
  emailPlaceholder: string = null;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translateService: TranslateService,
              public _auth:AuthProvider,
              public toastCtrl: ToastController) {

    this.translateService.get(['EMAIL','PASSWORD_RESET_SUCCESS','PASSWORD_RESET_FAIL','PASSWORD_RESET_NO_USER']).subscribe((value) => {
      this.emailPlaceholder = value.EMAIL;
      this.reset_success = value.PASSWORD_RESET_SUCCESS;
      this.reset_fail = value.PASSWORD_RESET_FAIL;
      this.reset_no_user = value.PASSWORD_RESET_NO_USER;
    });

    this.email = navParams.get('email') || "";
  }

  sendMail(){
    this._auth.forgotPassword(this.email).subscribe((data:{success:boolean})=>{
        if(data.success){
          let toast = this.toastCtrl.create({
            message: this.reset_success,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.goToRoot({});

        }else{
          let toast = this.toastCtrl.create({
            message: this.reset_fail,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, (err:HttpErrorResponse)=>{
        console.log(err);

        if(err.error.short_error=="USER_NOT_FOUND"){
          let toast = this.toastCtrl.create({
            message: this.reset_no_user,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswortPage');
  }

}
