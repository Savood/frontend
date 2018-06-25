import {Injectable} from '@angular/core';
import {Upload} from "../../models/upload";
import {User} from "../../models/user";
import {UploadWebProvider} from "../upload/upload-web";

/*
  Generated class for the AvatarProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageService {

  constructor(public uploadProvider: UploadWebProvider) {

  }


  changeAvatarMobile() {
  }


  //TODO: Add real functions
  private deletePreviousAvatar(user: User) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //
    // return new Promise((resolve, reject) => {
    //   if (user.avatarFileName) {
    //     this.uploadProvider.deleteFileStorage(user.avatarFileName, `${user.uid}/avatar`)
    //       .then(
    //         () => {
    //           user.avatarFileName = '';
    //           user.avatarURL= '';
    //           userRef.update(user);
    //           resolve();
    //         },
    //         (reason) => {
    //           console.log("error", reason);
    //           if(reason.code_ === "storage/object-not-found")
    //             resolve();
    //           else
    //             reject(reason);
    //         })
    //   } else {
    //     resolve()
    //   }
    // })
  }


  changeAvatarWeb(upload: Upload, user: User) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //
    // return new Promise((resolve, reject) => {
    //
    //   this.deletePreviousAvatar(user).then(() => {
    //
    //       this.uploadProvider.pushUpload(upload, `${user.uid}/avatar`).then(
    //         upload => {
    //
    //           let u = upload as Upload;
    //
    //           user.avatarURL = u.url;
    //           user.avatarFileName = u.name;
    //
    //           return userRef.update(user).then(
    //             () => resolve(),
    //             reason => reject(reason)
    //           )
    //
    //         }
    //       );
    //     },
    //     reason => reject(reason)
    //   )
    // })
  }


  private deletePreviousHeader(user: User) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //
    //
    // return new Promise((resolve, reject) => {
    //   if (user.headerFileName) {
    //     this.uploadProvider.deleteFileStorage(user.headerFileName, `${user.uid}/header`)
    //       .then(
    //         () => {
    //           user.headerFileName = '';
    //           user.headerURL= '';
    //           userRef.update(user);
    //           resolve()
    //         },
    //         (reason) => {
    //           console.log("error", reason);
    //           if(reason.code_ === "storage/object-not-found")
    //             resolve();
    //           else
    //             reject(reason);
    //         })
    //   } else {
    //     resolve()
    //   }
    // })
  }


  changeHeaderWeb(upload: Upload, user: User) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //
    // return new Promise((resolve, reject) => {
    //
    //   this.deletePreviousHeader(user).then(() => {
    //
    //       this.uploadProvider.pushUpload(upload, `${user.uid}/header`).then(
    //         upload => {
    //
    //           let u = upload as Upload;
    //
    //           user.headerURL = u.url;
    //           user.headerFileName = u.name;
    //
    //           return userRef.update(user).then(
    //             () => resolve(),
    //             reason => reject(reason)
    //           )
    //
    //         }
    //       );
    //     },
    //     reason => reject(reason)
    //   )
    // })
  }
}
