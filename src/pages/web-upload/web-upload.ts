import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Upload} from "../../models/upload";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the WebUploadAvatarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-web-upload',
  templateUrl: 'web-upload.html',
})
export class WebUploadPage {

  selectedFiles: FileList | null;
  currentUpload: Upload;
  loading: Loading;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _auth: AuthProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  uploadFile(user){
    if(this.navParams.get('type') === 'avatar'){
      const file = this.selectedFiles;
      if (file && file.length === 1) {
        this.currentUpload = new Upload(file.item(0));

        //console.log(this.currentUpload)
        this.loading.present();

        // this._image.changeAvatarWeb(this.currentUpload,user).then(
        //   () => {
        //     this.loading.dismiss();
        //     this.navCtrl.pop();
        //   },
        //   reason => {
        //     let toast = this.toastCtrl.create({
        //       message: reason.message,
        //       duration: 3000
        //     });
        //     this.loading.dismiss();
        //     toast.present();
        //   }
        // )
      } else {
        console.error('No file found!');
      }
    } else
      if (this.navParams.get('type') === 'header') {
        const file = this.selectedFiles;
        if (file && file.length === 1) {
          this.currentUpload = new Upload(file.item(0));

          //console.log(this.currentUpload)
          this.loading.present();

          // this._image.changeAvatarWeb(this.currentUpload,user).then(
          //   () => {
          //     this.loading.dismiss();
          //     this.navCtrl.pop();
          //   },
          //   reason => {
          //     let toast = this.toastCtrl.create({
          //       message: reason.message,
          //       duration: 3000
          //     });
          //     this.loading.dismiss();
          //     toast.present();
          //   }
          // )
        } else {
          console.error('No file found!');
        }
    } else {
      alert('No type specified!');
      this.navCtrl.pop();
      }
  }

}
