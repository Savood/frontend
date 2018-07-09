import {Component, ViewChild} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Upload} from "../../models/upload";
import {UsersService} from "../../providers";
import {Camera} from "@ionic-native/camera";

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

  @ViewChild('fileInput') fileInput;
  selectedFile: String | null;
  image: Blob;
  loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _user: UsersService,
              public camera: Camera,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }

  uploadFile() {
    if (this.image) {
      if (this.navParams.get('type') === 'avatar') {
        this.loading.present();
        this._user.usersIdImageJpegPost(this.navParams.get('userId'), this.image).subscribe(
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
      }
      else if (this.navParams.get('type') === 'header') {
        this.loading.present();
        this._user.usersIdBackgroundimageJpegPost(this.navParams.get('userId'), this.image).subscribe(
          () => {
            this.loading.dismiss();
            this.navCtrl.pop();
            this.toastCtrl.create({
              position: 'top',
              message: "Bild hochgeladen!",
              duration: 5000
            }).present();
          }
        )
      } else {
        alert('No type specified!');
        this.navCtrl.pop();
      }
    }
    else {
      console.error('No file found!');
    }
  }

  getOfferingImage() {
    // return 'url(' + this.form.controls['offeringPic'].value + ')';
    return this.selectedFile;
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
      }).then((data) => {
        this.selectedFile = 'date:image/jpg;base64,' + data;
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.selectedFile = imageData;
    };

    this.image = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }

}
