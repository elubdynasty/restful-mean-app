//connecting Angular Auth service to the backend

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/user/"; //common URL paths for HTTP API

@Injectable({providedIn: 'root'})

export class AuthService {
  private isAuthenticated = false;
  private token: string; //adding the token to auth requests
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>(); //is the user authenticated or not

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getisAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){ //return the observable
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL + 'signup', authData)
    .subscribe(()=>{
      this.router.navigate["/"]; //redirection on signup comp. when signup successful
    }, error=>{
      this.authStatusListener.next(); //push the false value to entire app and inform that this will not be authenticated
    });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + 'login', authData)
    .subscribe(response=>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated=true;
        this.userId = response.userId;
        this.authStatusListener.next(true); //informing everyone w/c component is interested abt the user being authenticated
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/']); //nav back to the homepage
      }
    }, error=>{
      this.authStatusListener.next(); //push the false value to entire app and inform that this will not be authenticated
    });
  }

  autoAuthUser(){
    //automatically auth the user if we got the info for it in the localStorage
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    //console.log(authInformation, expiresIn);
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);

    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    //informing everyone w/c component is interested abt the user being not authenticated anymore (exiting login)
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']); //nav back to the homepage

  }

  private setAuthTimer(duration: number){
    console.log('Setting timer: '+ duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);  //data will be serialized and stored in local storage
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');  //data will be serialized and stored in local storage
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate= localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }



}
