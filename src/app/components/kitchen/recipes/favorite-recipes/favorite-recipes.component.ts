import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from 'src/app/services/community.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss'],
})
export class FavoriteRecipesComponent implements OnInit {
  userID = this._userService.getUserID();
  user: User;
  favoriteRecipes = [];

  constructor(
    private _apiServices: ApiService,
    private spinner: NgxSpinnerService,
    private _userService: UserService,
    private _communityService: CommunityService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.spinner.show();
    console.log(this.userID);
    let userId = this.userID;
    this._communityService.getUser(`user/get-user/${userId}`).subscribe(
      (response) => {
        this.spinner.hide();
        this.user = response['Data'];
        console.log('user:', this.user);
        let apiKey = "&apiKey=8f9a788890054729a7d1374129136dcc"
        for (let recipe of this.user.favoriteRecipes) {

          this._apiServices
            .get(`recipes/${recipe}/information?amount=1&`, apiKey)
            .subscribe(
              (responseInfo) => {
                this.spinner.hide();
                console.log(responseInfo);
                this.favoriteRecipes.push(responseInfo);
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  isDark = false;
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
