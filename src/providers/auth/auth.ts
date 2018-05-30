import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {env} from '../../environment/environment';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  refresh_token: string;
  id_token :string;

  constructor(public _http: HttpClient) {
    this.loadToken()
  }

  getRefreshToken() {
    return this.refresh_token || localStorage.getItem('refresh_token') || null;
  }

  login(username:string, password:string){
    this._http.post(env.auth_endpoint + '/oauth2/token', {username,password})
      .subscribe(token=> this.saveToken(token));
  }

  register(email:string, username:string, password:string) {
    return this._http.post(env.auth_endpoint +'/register', {email, username, password})
  }

  logout(){
    console.log("Du bist jetzt raus");
  }

  loadToken(){
    this.id_token = localStorage.getItem('id_token');
    this.refresh_token = localStorage.getItem('refresh_token');
  }

  saveToken(token) {
    localStorage.setItem('id_token', token.id_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  }
}
