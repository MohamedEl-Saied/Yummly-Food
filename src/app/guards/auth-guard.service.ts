import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _userService: UserService, private _router: Router) { }

  canActivate(): boolean {
    console.log(this._userService.isAuthenticated());
    if (!this._userService.isAuthenticated()) {
      this._router.navigate(['/community']);
      return false;
    }
    return true;
  }
}

