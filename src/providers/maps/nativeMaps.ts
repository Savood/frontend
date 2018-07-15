import {ElementRef, Injectable} from '@angular/core';
import {Geocoder, GoogleMaps, GoogleMapsEvent, LatLng, Marker} from '@ionic-native/google-maps';
import {Location} from "../../models/location";

@Injectable()
export class NativeMapsService {

  map: any;

  constructor(public googleMaps: GoogleMaps,) {
  }

  init(element: ElementRef, location: Location, zoom: number) {

    let latLng = new LatLng(location.latitude, location.longitude);


      this.map = this.googleMaps.create(element.nativeElement,
        {
          camera: {
            target: latLng,
            zoom: zoom
          }
        });

  }

  /**
   * Creates Circle on the map
   * @param location the location of the circles centre
   * @param radius the radius of the circle
   * @param color the color of the circle
   * @returns
   */
  async createCircle(location:Location, radius:number, color:number[]){
    let latLng = new LatLng(location.latitude, location.longitude);

    let str_color:string = `rgba(${color[0]},${color[1]}, ${color[2]}, 0.15)`;
    let stroke_color:string = `rgba(${color[0]},${color[1]}, ${color[2]}, 0.8)`;

    return this.map.addCircleSync(
    {
      strokeColor: stroke_color,
      strokeWeight: 2,
      fillColor:str_color,
      map: this.map,
      center: latLng,
      radius: radius
    });
  }

  async addMarker(location: Location, title: string, draggable: boolean, icon?: object) {

    let latLng = new LatLng(location.latitude, location.longitude);

    return this.map.addMarker({
      title: title,
      position: latLng,
      draggable: draggable,
      icon: icon,
    }).then(
      (marker) => {
        return marker;
      }
    );
  }

  getMarkerPosition(marker: Marker): Location {
    return {latitude: marker.getPosition().lat, longitude: marker.getPosition().lng};
  }

  setMarkerPosition(marker: Marker, location: Location) {
    marker.setPosition(new LatLng(location.latitude, location.longitude));
  }

  async getAddress(location: Location): Promise<any> {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new Promise<any>((resolve, reject) => {
      return Geocoder.geocode({position: latLng}).then(
        (address) => {
          if (address[0]) {
            let newLocation = {
              street: address[0].thoroughfare ? address[0].thoroughfare : null,
              number: address[0].subThoroughfare ? address[0].subThoroughfare : null,
              zip: address[0].postalCode ? address[0].postalCode : null,
              city: address[0].locality ? address[0].locality : null,
            };
            resolve(newLocation);
          } else {
            reject('NO_ADDRESS_FOUND');
          }
        },
        () => {
          reject('GEOCODER_ERROR');
        });
    });
  }

  async getLocation(address: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return Geocoder.geocode({address: address}).then(
        (location) => {
          if (location[0]) {
            let newLocation: Location = {
              latitude: location[0].position.lat,
              longitude: location[0].position.lng
            };
            resolve(newLocation);
          } else {
            reject('NO_LOCATION_FOUND');
          }
        },
        () => {
          reject('GEOCODER_ERROR');
        });
    });
  }

  addListener(marker: Marker, event: any, desiredFunction: any){
    let nativeEvent: any;
    switch(event){
      case 'click': nativeEvent = GoogleMapsEvent.MARKER_CLICK; break;
      case 'dragend': nativeEvent = GoogleMapsEvent.MARKER_DRAG_END; break;
      case 'dragstart': nativeEvent = GoogleMapsEvent.MARKER_DRAG_START; break;
      case 'drag': nativeEvent = GoogleMapsEvent.MARKER_DRAG; break;
      default: nativeEvent = null;
    }

    if (nativeEvent) {
      marker.on(nativeEvent).subscribe(
        () => {
          desiredFunction()
        }
      )
    } else {
      alert("Event not found");
    }
  }
}
