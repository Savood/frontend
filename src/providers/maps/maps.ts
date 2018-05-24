import {HttpClient} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMap, GoogleMaps, LatLng} from "@ionic-native/google-maps";
import {} from '@types/googlemaps';
import {Geolocation} from "@ionic-native/geolocation";

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
          alert("ERROR: {{error.message}}");
          return new LatLng(8.4660395, 49.4874592);
        }
      )
    } else {
      alert('ERROR: Location Service not available');
      return new Promise(() => new LatLng(8.4660395, 49.4874592));
    }
  }

  initMap(mapElement: ElementRef, location?: LatLng) {
    if(location){
      return this.newMap(mapElement, location)
    } else {
      this.getLocation().then(
        (location) => {
          return this.newMap(mapElement, location)
        });
    }
    console.log("hello")
  }

  private newMap(mapElement: ElementRef, location: LatLng): any{
    if (this.plt.is('ios') || this.plt.is('android')) {
      return GoogleMaps.create(mapElement.nativeElement, {
        camera: {
          target: location,
          zoom: 15,
        }
      });
    } else {
      return new google.maps.Map(mapElement.nativeElement, {
        center: location,
        zoom: 15
      });
    }
  }

  //TODO: needs testing
  newMarker(location: LatLng, title: string, map: any) {
    console.log(map);
    if (map instanceof GoogleMap) {
      console.log(map);
      map.addMarker({
        title: title,
        position: location
      });
    }

    if (map instanceof google.maps.Map) {
      console.log(map);
      new google.maps.Marker({
        title: title,
        position: location,
        map: map
      });
    }

  }

}
