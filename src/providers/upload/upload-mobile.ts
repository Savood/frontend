import {Injectable} from '@angular/core';
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {Camera, CameraOptions} from "@ionic-native/camera";

/*
  Generated class for the UploadMobileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const url: string = 'http://192.168.0.7:8080/api/uploadImage';


@Injectable()
export class UploadMobileProvider {


  constructor(private transfer: FileTransfer,
              private camera: Camera) {
  }

  uploadFile(imageURI, imageFileName) {
    return new Promise((resolve, reject) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      };
      fileTransfer.upload(imageURI, url, options)
        .then((data) => {
          console.log(data + " Uploaded Successfully");
          imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg";
          resolve(data)
        }, (err) => {
          reject(err);
        });

    })


  }

  getImage() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    return this.camera.getPicture(options)


  }

  getCamera() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE
    }

    return this.camera.getPicture(options)


  }

}
