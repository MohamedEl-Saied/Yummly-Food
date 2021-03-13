import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from './../../models/admin';
import { CommunityService } from './../../services/community.service';
import { UserService } from './../../services/user.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  admin = new Admin();
  constructor(
    private _communityService: CommunityService,
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  login(email, password) {
    console.log(email, password)
    this.admin.email = email;
    this.admin.password = password;
    this._communityService.LoginAdmin('admin/login', this.admin).subscribe(
      (response) => {
        console.log(response);

        this._userService.login(
          response['Data'].token,
          response['Data'].adminID
        );
        this._router.navigate(['dashboard'])
      },
      (error) => {
        console.log(error)
      }
    );
  }
}
