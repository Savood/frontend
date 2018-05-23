import {HttpClient} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMap, GoogleMaps, LatLng} from "@ionic-native/google-maps";
import {} from '@types/googlemaps';
import {Geolocation} from "@ionic-native/geolocation";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the MapsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsService {

  constructor(public http: HttpClient,
              public plt: Platform,
              public geolocation: Geolocation) {
  }

  getLocation(): Promise<LatLng> {
    if (this.geolocation) {
      return this.geolocation.getCurrentPosition().then(
        (position) => {
          return new LatLng(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log(error.message);
          return new LatLng(0, 0);
        }
      )
    } else {
      alert('ERROR');
      return new Promise(() => new LatLng(0, 0));
    }
  }

  initMap(mapElement: ElementRef) {
    this.getLocation().then(
      (location) => {
        if (this.plt.is('ios') || this.plt.is('android')) {
          GoogleMaps.create(mapElement.nativeElement, {
            camera: {
              target: location,
              zoom: 15,
            }
          });
        } else {
          new google.maps.Map(mapElement.nativeElement, {
            center: location,
            zoom: 15
          });

        }
      });
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
