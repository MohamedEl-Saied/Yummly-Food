import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from './../../../services/community.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';
import { MustMatch } from './Match';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: User;
  form: FormGroup;
  userID = this._userService.getUserID();
  showFooter = false;
  constructor(
    private _userService: UserService,
    private _communityService: CommunityService,
    private _flashMessagesService: FlashMessagesService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.spinner.show();
    this._communityService.getUser(`user/get-user/${this.userID}`).subscribe(
      (response) => {
        this.spinner.hide();
        this.user = response['Data'];
        this.showFooter = true;
        console.log('user:', this.user);
        this.form = this.fb.group(
          {
            UsernameValid: [
              this.user.username,
              [Validators.required, Validators.minLength(6)],
            ],
            emailValid: [
              this.user.email,
              [Validators.required, Validators.email],
            ],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
          },
          {
            validator: MustMatch('password', 'confirmPassword'),
          }
        );
      },
      (error) => {
        let errorMessage = error['error'].Error;
        this._flashMessagesService.show(errorMessage, {
          cssClass: 'alert alert-danger',
          timeout: 2000,
        });
      }
    );
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (imageUrl != '') {
      return this._sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }
  cancleEditing() {
    let isCancled = confirm('Cancle Editing Operation ?');
    if (isCancled) {
      this._router.navigate([`/community/profile/${this.userID}`]);
    }
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
      console.log(this.slectedFile);
    }
  }

  updateUser(username, email, password, confirmedPassword) {
    this.spinner.show();
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmedPassword', confirmedPassword);
    this._communityService
      .editUser('user/edit-user', this.userID, formData)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);

          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
          setTimeout(() => {
            this._router.navigate([`/community/profile/${this.userID}`]);
          }, 2000);
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
        }
      );
  }
  isDark;
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
