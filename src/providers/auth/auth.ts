import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {env} from '../../environment/environment';
import {JwtHelper} from 'angular2-jwt';
import {User} from "../../models/user";
import {UsersService} from "../api/users.service";
import {UserShort} from "../../models/userShort";
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

  /**
   * Returns the user id of the current user
   * @returns {string} UserId
   */
  getActiveUserId():string {
    if(this.getToken()) {
      return this.helper.decodeToken(this.getToken()).userid;
    }
  }

  /**
   * Returns the email of the current user
   * @returns {string} email or null
   */
  getActiveUserEmail():string {
    if(this.getToken()) {
      return this.helper.decodeToken(this.getToken()).email;
    }else{
      return null;
    }
  }

  /**
   * returns if the current user matches another user entity
   * @param user User entity
   * @returns {boolean}
   */
  isActiveUser(user:User):boolean{
    if(this.getToken()) {
      return this.getActiveUserId() === user._id;
    }
  }

  /**
   * Fetches the User entity of the current user
   * @returns {Observable<User>} Observable of the request
   */
  getActiveUser(){
    if(this.getToken()) {
      return this._user.getUserById(this.getActiveUserId());
    }
  }

  /**
   * gets the saved refreshtoken
   * @returns {string} Refreshtoken
   */
  getRefreshToken() {
    return this.refresh_token || localStorage.getItem('refresh_token') || null;
  }

  /**
   * tests if the current user is loggedIn
   * @returns {boolean} is user locked in?
   */
  isLoggedIn():boolean{
    let token = this.getToken();

    return token && !this.helper.isTokenExpired(this.getToken());
  }

  /**
   * Tests if the id token of the current user is expired
   * @returns {boolean} is token expired?
   */
  isTokenExpired(){
    return this.helper.isTokenExpired(this.getToken());
  }

  /**
   * renews the id token via refreshtoken
   * @returns {Promise<any>}
   */
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

  /**
   * resets a user's password
   * @param email email of the user
   * @returns {Observable<Object>} Shows success of request
   */
  forgotPassword(email:string){
    let body = new URLSearchParams();
    body.set('email', email);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'forgot', body.toString(), options);
  }

  /**
   * Method to login a user via password
   * @param email
   * @param password
   * @returns {Observable<Object>} returns an Object with the refresh- and id- token
   */
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

  /**
   * Register a new user via email and password
   * @param email Email of new user
   * @param password Password of the new user
   * @returns {Observable<Object>} Return if the request was successful
   */
  register(email:string, password:string){

    let body = new URLSearchParams();
    body.set('password', password);
    body.set('email', email);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this._http.post(env.auth_endpoint + 'register', body.toString(), options);
  }

  /**
   * logout the current user by deleting the local Storage
   */
  logout(){
    localStorage.clear();
  }

  /**
   * Loads the token into cache
   */
  loadToken(){
    this.id_token = localStorage.getItem('id_token');
    this.refresh_token = localStorage.getItem('refresh_token');
  }

  /**
   * Gets the token from localStorage
   * @returns {string|null} id Token
   */
  getToken(){
    return localStorage.getItem('id_token');
  }

  /**
   * Saves the token by saving it into local storage
   * @param token 
   */
  saveToken(token) {
    localStorage.setItem('id_token', token.id_token);
    localStorage.setItem('refresh_token', token.refresh_token);
  }
}
