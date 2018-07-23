import {Component, ViewChild} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
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

  /**
   * If an image was chosen by the user, upload it to the database
   * If the page was opened for uploading an avatar, upload the image as Avatar
   * If the page was opened for uploading an header, upload the image as Header
   */
  uploadFile() {
    if (this.image) {
      if (this.navParams.get('type') === 'avatar') {
        this.loading.present();
        this._user.usersIdImageJpegPost(this.navParams.get('userId'), this.image).subscribe(
          () => {
            this.loading.dismiss();
            this.navParams.get('callback')();
            this.navCtrl.pop();
            this.toastCtrl.create({
              position: 'top',
              message: "Bild hochgeladen!",
              duration: 5000
            }).present();
          },
          () => {
            this.loading.dismiss();
            this.toastCtrl.create({
              position: 'top',
              message: "Sorry, Fehler bei uns, versuch es später erneut!",
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
            this.navParams.get('callback')();
            this.navCtrl.pop();
            this.toastCtrl.create({
              position: 'top',
              message: "Bild hochgeladen!",
              duration: 5000
            }).present();
          },
          () => {
            this.loading.dismiss();
            this.toastCtrl.create({
              position: 'top',
              message: "Sorry, Fehler bei uns, versuch es später erneut!",
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
        this.toastCtrl.create({
          position: 'top',
          message: "Hey, gib ein Bild an!",
          duration: 5000
        }).present();
    }
  }

  /**
   * Returns the currently selected image
   * @returns the currently selected image
   */
  getOfferingImage() {
    // return 'url(' + this.form.controls['offeringPic'].value + ')';
    return this.selectedFile;
  }

  // TODO: A way to use the camera and actually choose the source from a context menu should be added
  /**
   * Run when the "Choose a pic"-Card is clicked
   * Opens the dialog which allows to choose an image
   */
  getPicture() {
      this.fileInput.nativeElement.click();
  }

  /**
   * On click of the input file field
   * As the input file field is actually hidden, only called from the getPicture method (through faking a click)
   * @param event Upload event of the hidden input field which is called when an image gets chosen
   */
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.selectedFile = (readerEvent.target as any).result;
    };
    if(event.target.files[0]){
      this.image = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
