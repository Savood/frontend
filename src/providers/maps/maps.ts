import {HttpClient} from '@angular/common/http';
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

  initMap(mapElement: ElementRef) {
    if (this.plt.is('ios') || this.plt.is('android')) {
      let map = GoogleMaps.create(mapElement.nativeElement, {
        camera: {
          target: {lat: -34.397, lng: 150.644},
          zoom: 15,
        }
      });
      map.addMarker({
        title: 'Ionic',
        icon: 'red',
        position: {lat: -34.397, lng: 150.644}
      });
    } else {
      let location: LatLng = new LatLng( -34.397, 150.644);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            location = new LatLng(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log(error)
          }
        )
      }
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
  newMarker(location: LatLng, title: string, map: any) {
    if (map instanceof GoogleMap) {
      map.addMarker({
        title: title,
        icon: 'red',
        position: location
      });
    }

    if (map instanceof google.maps.Map) {
      new google.maps.Marker({
        title: title,
        position: location,
        icon: 'red',
        map: map
      });
    }

  }

}
