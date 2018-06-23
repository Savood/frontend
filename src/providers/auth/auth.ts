import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {env} from '../../environment/environment';
import {JwtHelper} from 'angular2-jwt';
import {User} from "../../models/user";
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  refresh_token: string;
  id_token :string;
  helper: JwtHelper;

  constructor(public _http: HttpClient) {
    this.loadToken();

    this.helper = new JwtHelper();

  }

  getActiveUserId():string {
    return this.helper.decodeToken(this.getToken()).userid;
  }

  isActiveUser(user:User):boolean{
    return this.getActiveUserId() === user._id;
  }

  getRefreshToken() {
    return this.refresh_token || localStorage.getItem('refresh_token') || null;
  }

  refreshToken(): Observable<Object> {
    let ref_token = this.getRefreshToken();
    console.log("Refresh_token",ref_token);

    if(ref_token) {
      let body = new URLSearchParams();
      body.set('refresh_token', ref_token);
      body.set('grant_type', 'refresh_token');

      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };

      return this._http.post(env.auth_endpoint + 'oauth2/token', body.toString(), options)


    }else {
      return Observable.throw("No Refreshtoken");
    }
  }

  isLoggedIn(){
    let token = this.getToken();
    return token && !this.helper.isTokenExpired(this.getToken());
  }

  login(username:string, password:string){

    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');


    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'oauth2/token', body.toString(), options);
  }

  register(email:string, username:string, password:string) {
    let body = new URLSearchParams();
    body.append('email', email);
    body.append('username', username);
    body.append('password', password);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this._http.post(env.auth_endpoint +'/register', body, options).subscribe(data=>console.log('hallo'));
  }

  logout(){
    localStorage.clear();
  }

  loadToken(){
    this.id_token = localStorage.getItem('id_token');
    this.refresh_token = localStorage.getItem('refresh_token');
  }

  getToken(){
    return this.id_token || localStorage.getItem('id_token');
  }

  saveToken(token) {
    console.log(token);
    localStorage.setItem('id_token', token.id_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  }
}
