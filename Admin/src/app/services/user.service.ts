import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  logged = new Subject<boolean>();
  jwtHelper = new JwtHelperService();

  constructor(private _router: Router, private _httpClient: HttpClient) {
    //alert(this.isLogged());
    // this.logged.next(this.isLogged());
  }
  login(token: string, userID: string): any {
    localStorage.setItem('Token', token);
    localStorage.setItem('adminID', userID);
    //this.logged.next(true);
    this.setLoggedStatus(true);
  }

  // addToken(token: string) {
  //   localStorage.setItem("token", token);
  // }
  getToken() {
    return localStorage.getItem('Token');
  }
  getUserID() {
    return localStorage.getItem('userID');
  }
  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('adminID');
    this.setLoggedStatus(false);
  }
  isLogged(): boolean {
    let token = localStorage.getItem('Token');
    if (token == null) {
      return false;
    }
    return true;
  }
  setLoggedStatus(status: boolean) {
    this.logged.next(status);
  }
  getLoggedStatus() {
    return this.logged.asObservable();
  }
  // logout() {
  //   localStorage.removeItem("Email");
  //   //this.logged.next(false);
  //   this.setLoggedStatus(false);
  // }

  // setLoggedStatus(status: boolean) {
  //   this.logged.next(status);
  // }

  // getLoggedStatus(): Observable<any> {
  //   return this.logged.asObservable();
  // }

  // isLogged(): boolean {
  //   let email = localStorage.getItem("Email");
  //   if (email == null)
  //     return false;

  //   return true;
  // }

  //
  isAuthenticated(): boolean {
    const token = localStorage.getItem('Token');
    console.log(token);
    // Check whether the token is expired and return true or false
    if (!token) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      this._router.navigate(['/']);
      return false;
    }
    // is expired ? true => notAuthenticated !
  }
}
