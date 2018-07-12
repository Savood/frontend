import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {env} from '../../environment/environment';
import {JwtHelper} from 'angular2-jwt';
import {User} from "../../models/user";
import {UsersService} from "../api/users.service";
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

  constructor(public _http: HttpClient, public _user: UsersService) {
    this.loadToken();

    this.helper = new JwtHelper();

  }

  getActiveUserId():string {
    if(this.getToken()) {
      return this.helper.decodeToken(this.getToken()).userid;
    }
  }

  getActiveUserEmail():string {
    if(this.getToken()) {
      return this.helper.decodeToken(this.getToken()).email;
    }
  }

  isActiveUser(user:User):boolean{
    if(this.getToken()) {
      return this.getActiveUserId() === user._id;
    }
  }

  getActiveUser(){
    if(this.getToken()) {
      return this._user.getUserById(this.getActiveUserId());
    }
  }

  getRefreshToken() {
    return this.refresh_token || localStorage.getItem('refresh_token') || null;
  }

  isLoggedIn():boolean{
    let token = this.getToken();

    return token && !this.helper.isTokenExpired(this.getToken());
  }

  isTokenExpired(){
    return this.helper.isTokenExpired(this.getToken());
  }

  async renewToken(){

    let refresh_token =  this.getRefreshToken();
    let body = new URLSearchParams();

    if(!refresh_token)
      return null;

    body.set('refresh_token', refresh_token);
    body.set('grant_type', 'refresh_token');

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let token = null;
    try{
      token = await this._http.post(env.auth_endpoint + 'oauth2/token', body.toString(), options).toPromise();
    }catch(err){
    }

    if(token) {
      this.saveToken(token);
    }

    return token;

  }

  forgotPassword(email:string){
    let body = new URLSearchParams();
    body.set('email', email);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'forgot', body.toString(), options);
  }

  login(email:string, password:string){

    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', 'password');


    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'oauth2/token', body.toString(), options);
  }

  register(email:string, password:string){

    let body = new URLSearchParams();
    body.set('password', password);
    body.set('email', email);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'register', body.toString(), options);
  }

  logout(){
    localStorage.clear();
  }

  loadToken(){
    this.id_token = localStorage.getItem('id_token');
    this.refresh_token = localStorage.getItem('refresh_token');
  }

  getToken(){
    return localStorage.getItem('id_token');
  }

  saveToken(token) {
    localStorage.setItem('id_token', token.id_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  }
}
