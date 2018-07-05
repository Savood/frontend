import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Upload} from "../../models/upload";
import {UsersService} from "../../providers";

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
  loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _user: UsersService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  uploadFile() {
    if (this.navParams.get('type') === 'avatar') {
      const file = this.selectedFiles.item(0);
      if (file) {
        const blobImage: Blob = file;
        console.log(blobImage.size);
        this.loading.present();
        this._user.usersIdImageJpegPost(this.navParams.get('userId'), blobImage).subscribe(
          () => {
            this.loading.dismiss();
            this.navCtrl.pop();
            this.toastCtrl.create({
              position: 'top',
              message: "Bild hochgeladen!",
              duration: 5000
            }).present();
          }
        );
      } else {
        console.error('No file found!');
      }
    } else if (this.navParams.get('type') === 'header') {
      const file = this.selectedFiles.item(0);
      if (file) {
        const blobImage: Blob = file;
        this.loading.present();
        this._user.usersIdBackgroundimageJpegPost(this.navParams.get('userId'), blobImage).subscribe(
          () => {
            this.loading.dismiss();
            this.navCtrl.pop();
            this.toastCtrl.create({
              position: 'top',
              message: "Bild hochgeladen!",
              duration: 5000
            }).present();
          }
        );
      } else {
        console.error('No file found!');
      }
    } else {
      alert('No type specified!');
      this.navCtrl.pop();
    }
  }

}
