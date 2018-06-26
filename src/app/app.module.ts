import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { Geolocation} from "@ionic-native/geolocation";
import {DatePicker} from "@ionic-native/date-picker";

import {User, APIS, Api} from '../providers';
import { MyApp } from './app.component';
import { MapsService } from '../providers/maps/maps';
import { AuthProvider } from '../providers/auth/auth';
import {AuthInterceptorService} from "../providers/auth/auth_interceptor";

import { IonicImageViewerModule } from 'ionic-img-viewer';
import {SignupPage} from "../pages/signup/signup";
import {SignupPageModule} from "../pages/signup/signup.module";
import {ImageService} from "../providers/api/image.service";
import {UploadWebProvider} from "../providers/upload/upload-web";
import {Deeplinks} from "@ionic-native/deeplinks";
import {SocialSharing} from "@ionic-native/social-sharing";


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicImageViewerModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    APIS,
    Api,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    DatePicker,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    Deeplinks,
    Geolocation,
    MapsService,
    ImageService,
    UploadWebProvider,
    AuthProvider,
    SocialSharing
  ]
})
export class AppModule { }
