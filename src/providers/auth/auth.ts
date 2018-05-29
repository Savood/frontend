import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public authTokenStale: string = 'stale_auth_token';
  public authTokenNew: string = 'new_auth_token';
  public currentToken: string;

  constructor(public _http: HttpClient) {

  }

  getAuthToken() {
    return this.currentToken;
  }

  refreshToken(): Observable<string> {

    //TODO Add refreshtoken
    this.currentToken = this.authTokenNew;

    return Observable.of(this.authTokenNew).delay(200)

  }
}
