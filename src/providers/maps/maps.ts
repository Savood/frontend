import {HttpClient} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMaps} from "@ionic-native/google-maps";
import {JSMapsService} from "./jsMaps";
import {NativeMapsService} from "./nativeMaps";
import {Location} from "../../models/location";

/*
  Generated class for the MapsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsService {

  map: any;

  constructor(public http: HttpClient,
              public plt: Platform) {
    if (this.plt.is('cordova') &&
      (this.plt.is('ios') || this.plt.is('android'))) {
      this.map = new NativeMapsService(GoogleMaps);
    } else {
      this.map = new JSMapsService();
    }
  }

  initMap(mapElement: ElementRef, location: Location) {
    let zoom: number = 15;
    if (location) {
      return this.map.init(mapElement, location, zoom);
    } else {
      return this.map.init(mapElement, location, zoom);
    }
  }

  async newMarker(location: Location, title: string, draggable?: boolean): Promise<any> {
    return this.map.addMarker(location, title, draggable)
  }

  getMarkerPosition(marker: any): any {
    return this.map.getMarkerPosition(marker);
  }

  async getAddress(location: Location): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.map.getAddress(location).then(
        (results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        });
    });
  }

}
