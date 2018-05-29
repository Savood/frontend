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

  refresh_token: string;
  id_token :string;

  constructor(public _http: HttpClient) {
    this.loadToken()
  }

  getAuthToken() {
    return localStorage.getItem('refresh_token');
  }

  login(username:string, password:string){
    this._http.post('/oauth2/token', {username,password})
      .subscribe(token=> this.saveToken(token));
  }

  register(email:string, username:string, password:string) {
    this._http.post('/register', {email,username,password})
      .subscribe(data =>{console.log(data)}, err=>{console.log(err)});
  }

  logout(){
    console.log("Du bist jetzt raus");
  }

  loadToken(){
    id_token = localStorage.getItem('id_token');
    refresh_token = localStorage.getItem('refresh_token');
  }

  saveToken(token){
    localStorage.setItem('id_token', token.id_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  }
}
