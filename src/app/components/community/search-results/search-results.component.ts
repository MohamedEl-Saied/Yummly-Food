import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { User } from './../../../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  searchParam;
  userID = this._userService.getUserID();
  user: User;
  users = [];
  posts = [];
  comments = [];
  showFooter = false;
  constructor(
    private route: ActivatedRoute,
    private _userService: UserService,
    private sanitizer: DomSanitizer,
    private _communityService: CommunityService,
    private _flashMessagesService: FlashMessagesService,
    private _router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.searchParam = params['username'];
      this._communityService
        .searchUser(`user/get-user-by-username/${this.searchParam}`)
        .subscribe(
          (response) => {
            this.spinner.hide();
            console.log(response);
            this.users = response['Data'];
            this.posts = response['foundPost'];
            this.comments = response['foundComment'];

            this.showFooter = true;
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
          }
        );
    });
    this.getUser();
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (imageUrl != '') {
      return this.sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }
  getUser() {
    this.spinner.show();
    console.log(this.userID);
    let userId = this.userID;
    this._communityService.getUser(`user/get-user/${userId}`).subscribe(
      (response) => {
        this.spinner.hide();
        // console.log('This Posts from 86 :', this.postContent);
        this.user = response['Data'];
        console.log('user:', this.user);
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
  showUser(searchID) {
    this._router.navigate([`community/profile/${searchID}`]);
  }
  flaguser = true;
  flagpost = true;
  flagcomment = true;
  filterSearch(filter) {
    if (filter == 'users') {
      this.flaguser = true;
      this.flagpost = false;
      this.flagcomment = false;
    } else if (filter == 'posts') {
      this.flagpost = true;
      this.flaguser = false;
      this.flagcomment = false;
    } else if (filter == 'comments') {
      this.flagcomment = true;
      this.flaguser = false;
      this.flagpost = false;
    } else if (filter == 'all') {
      this.flagpost = true;
      this.flaguser = true;
      this.flagcomment = true;
    }
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
