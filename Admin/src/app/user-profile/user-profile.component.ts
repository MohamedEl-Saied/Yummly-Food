import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/user';
import { CommunityService } from 'app/services/community.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isResponseDone = false;
  user: User;
  isViewDetials = false;
  userID;
  constructor(
    private _userService: UserService,
    private _communityService: CommunityService,
    // private _flashMessagesService: FlashMessagesService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log(this._router.url)

    this._activatedRoute.params.subscribe(params => {
      this.userID = params['id'];

      console.log(this.userID);
      this.getUser();

    });


  }
  getUser() {
    this._communityService.getUser(`user/get-user/${this.userID}`).subscribe(
      (response) => {
        this.user = response['Data'];
        console.log('user:', this.user);
        if (this._router.url == `/dashboard/user/${this.userID}/details`) {
          this.isViewDetials = true;
        }
        this.isResponseDone = true;
      },
      (error) => {
        console.log(error)
        // let errorMessage = error['error'].Error;
        // this._flashMessagesService.show(errorMessage, {
        //   cssClass: 'alert alert-danger',
        //   timeout: 2000,
        // });
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

  updateUser(username, email) {
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', '');
    formData.append('confirmedPassword', '');
    this._communityService
      .editUser('user/edit-user', this.userID, formData)
      .subscribe(
        (response) => {

          console.log(response);
          this._router.navigate(['/dashboard/users-table'])
          let successMessage = response['Message'];
          // this._flashMessagesService.show(successMessage, {
          //   cssClass: 'alert alert-success',
          //   timeout: 2000,
          // });
          //   setTimeout(() => {
          //     this._router.navigate([`/community/profile/${this.userID}`]);
          //   }, 2000);
          // },
        },
        (error) => {
          console.log(error);
          let errorMessage = error['error'].Error;
          // this._flashMessagesService.show(errorMessage, {
          //   cssClass: 'alert alert-danger',
          //   timeout: 2000,
          // });
        }
      );
  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
}
