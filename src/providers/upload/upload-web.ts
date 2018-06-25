import {Injectable} from '@angular/core';


import {Observable} from 'rxjs/Observable';
import {Upload} from "../../models/upload";
import {AuthProvider} from "../auth/auth";

@Injectable()
export class UploadWebProvider {

  basePath = 'uploads';
  uploads: Observable<Upload[]>;

  constructor(public auth: AuthProvider) {
  }


  // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
  // TODO: Add real dupload function
  pushUpload(upload: Upload, path: string) {
    // const storageRef = firebase.storage().ref();
    // const uploadTask = storageRef.child(`${this.basePath}/${path}/${upload.file.name}`).put(upload.file);
    //
    //
    // return new Promise((resolve, reject) => {
    //   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //     (snapshot: firebase.storage.UploadTaskSnapshot) => {
    //       // upload in progress
    //       const snap = snapshot;
    //       upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
    //     },
    //     (error) => {
    //       // upload failed
    //       reject(error);
    //     },
    //     () => {
    //       // upload success
    //       if (uploadTask.snapshot.downloadURL) {
    //         upload.url = uploadTask.snapshot.downloadURL;
    //         upload.name = upload.file.name;
    //         resolve(upload);
    //         return;
    //       } else {
    //         reject('No download URL!');
    //       }
    //     },
    //   );
    // })
  }


  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  // TODO: Add real delete (why delete storage?) function
  deleteFileStorage(name: string, path?: string) {
    // const storageRef = firebase.storage().ref();
    //
    // let p = `${this.basePath}/`;
    // if (path) {
    //   p = p + `${path}/`
    // }
    // p = p + name;
    //
    //
    // return storageRef.child(p).delete()
  }
}
