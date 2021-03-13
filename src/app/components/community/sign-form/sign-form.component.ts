import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { CommunityService } from '../../../services/community.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { MustMatch } from './MustMatch';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.scss'],
})
export class SignFormComponent implements OnInit {
  submitted = false;
  isDark = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _communityService: CommunityService,
    private location: Location,
    private _userService: UserService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService
  ) {
    this.createForm();
    this.singInForm();
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        Username: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }
  singInForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  user = new User();
  ngOnInit(): void { }

  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
      console.log(this.slectedFile);
    }
  }

  singUp(username, email, password, confirmedPassword) {
    // this.user.username = username;
    // this.user.email = email;
    // this.user.password = password;
    // this.user.confirmedPassword = confirmedPassword;
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmedPassword', confirmedPassword);
    this._communityService.CreateUser('user/register', formData).subscribe(
      (response) => {
        console.log(response);
        this.buttonClicked();
        let successMessage = response['Message'];
        this._flashMessagesService.show(successMessage, {
          cssClass: 'alert alert-success m-t',
          timeout: 2000,
        });
      },
      (error) => {
        let errorMessage = error['error'].Error;
        this._flashMessagesService.show(errorMessage, {
          cssClass: 'alert alert-danger m-t',
          timeout: 2000,
        });
      }
    );
  }
  login(Inputemail, Inputpassword) {
    console.log(Inputemail, Inputpassword);
    this.user.email = Inputemail;
    this.user.password = Inputpassword;

    this._communityService.LoginUser('user/login', this.user).subscribe(
      (response) => {
        console.log(response);

        this._userService.login(
          response['Data'].token,
          response['Data'].userID
        );
        let successMessage = response['Message'];
        this._flashMessagesService.show(successMessage, {
          cssClass: 'alert alert-success m-t',
          timeout: 2000,
        });
        setTimeout(() => {
          this.router.navigate(['community/show-posts']);
        }, 2000);
      },
      (error) => {
        let errorMessage = error['error'].Error;
        this._flashMessagesService.show(errorMessage, {
          cssClass: 'alert alert-danger m-t',
          timeout: 2000,
        });
      }
    );
  }
  flag = false;
  buttonClicked() {
    this.flag = !this.flag;
    this.loginForm.reset();
    this.registerForm.reset();
  }
  stopSubmitting() {
    return false;
  }
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }
}
