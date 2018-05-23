import { HttpClient } from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMap, GoogleMaps, LatLng} from "@ionic-native/google-maps";

/*
  Generated class for the MapsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsService {

  constructor(public http: HttpClient,
    public plt: Platform) {
  }

  initMap(location: LatLng, mapElement: ElementRef){
    if(this.plt.is('ios') ||this.plt.is('android')) {
      let map = GoogleMaps.create(mapElement.nativeElement, {
        camera: {
          target: location,
          zoom: 15,
        }
      });
      map.addMarker({
        title: 'Ionic',
        icon: 'red',
        position: location
      });
    } else {
      let map = new google.maps.Map(mapElement.nativeElement, {
        zoom: 15,
        center: location
      });
      new google.maps.Marker({
        position: location,
        map: map
      });
    }
  }

  //TODO: needs testing
  newMarker(location: LatLng, title: String, map: any){
    if(map instanceof GoogleMap) {
      map.addMarker({
        title: 'Ionic',
        icon: 'red',
        position: location
      });
    }

    if(map instanceof google.maps.Map) {
      new google.maps.Marker({
        position: location,
        map: map
      });
    }

  }

}
