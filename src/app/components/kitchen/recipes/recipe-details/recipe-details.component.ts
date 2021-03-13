import { Recipe } from './../../../../models/recipe';
import { RatingService } from './../../../../services/rating.service';
import { FavoritesService } from './../../../../services/favorites.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from 'src/app/services/community.service';
import { User } from 'src/app/models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  recipeDetails: any;
  recipeDetailsName: string;
  moreRecipes: any;
  recipeID;
  isCreateClicked = false;
  userID = this._userService.getUserID();
  flag2 = true;
  flag3 = false;
  flag4 = false;
  flag6 = false;
  flag7 = false;
  flag5 = false;
  flagFav = false;
  flagdisable = false;
  rating;
  ratingRecipe;
  recipeRating = new Recipe();
  up;
  lower;
  currentURL = '';
  user: User;
  userr = new User();
  showFooter = false;
  isSignIn: Boolean = false;
  favoriteButtonFlag = false;
  rateButtonFlag = false;
  ratedRecipe = 0;
  shareToCommunityFlag = false;
  metricorus = 'us';
  recipeNut;
  series = [];
  labels = [];
  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private _favoritesServices: FavoritesService,
    private _userService: UserService,
    private _communityService: CommunityService,
    private _ratingService: RatingService,
    private sanitizer: DomSanitizer
  ) {
    this.currentURL = window.location.href;
  }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      const prodId = params['id'];
      this.recipeID = params['id'];
      console.log(prodId);
      let apiKey = "&apiKey=17fe369a2f744693830980ad3df01b3a"

      this._apiServices
        .get(`recipes/${prodId}/information?amount=1&includeNutrition=true&`, apiKey)
        .subscribe(
          (responseInfo) => {
            this.spinner.hide();
            this.showFooter = true;
            this.recipeDetails = responseInfo;
            console.log(this.recipeDetails);
            for (const [key, value] of Object.entries(
              responseInfo['nutrition']['caloricBreakdown']
            )) {
              console.log(`${key}: ${value}`);
              this.labels.push(key);
              this.series.push(value);
            }
            console.log(this.labels, this.series);
            this.chartOptions = {
              series: this.series,
              chart: {
                width: 380,
                type: 'pie',
              },
              labels: this.labels,
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],
            };
            if (this.userID != null) {
              this.getUser(this.userID);
              this.isSignIn = true;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      this._ratingService
        .getAndCreateRating(`rating/get-recipe-rating/${prodId}`)
        .subscribe((response) => {
          console.log(response);
          this.ratingRecipe = response['Data'];
          this.up =
            5 * response['Data']['rating_5'] +
            4 * response['Data']['rating_4'] +
            3 * response['Data']['rating_3'] +
            2 * response['Data']['rating_2'] +
            1 * response['Data']['rating_1'];
          this.lower =
            response['Data']['rating_5'] +
            response['Data']['rating_4'] +
            response['Data']['rating_3'] +
            response['Data']['rating_2'] +
            response['Data']['rating_1'];
          console.log(this.lower);
          if (this.lower == 0 || this.up == 0) {
            this.rating = 0;
          } else {
            this.rating = this.up / this.lower;
            this.rating = Math.floor(this.rating);
          }
          console.log(this.rating);
        });
    });
  }

  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
      console.log(this.slectedFile);
    }
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (imageUrl != '') {
      return this.sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }

  singUp(username, email, password, confirmedPassword) {
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
        console.log(successMessage);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  login(Inputemail, Inputpassword) {
    console.log(Inputemail, Inputpassword);
    this.userr.email = Inputemail;
    this.userr.password = Inputpassword;

    this._communityService.LoginUser('user/login', this.userr).subscribe(
      (response) => {
        this.isSignIn = true;
        this.favoriteButtonFlag = false;
        this.shareToCommunityFlag = false;
        this.rateButtonFlag = false;

        this._userService.login(
          response['Data'].token,
          response['Data'].userID
        );
        this.userID = this._userService.getUserID();
        this.getUser(this.userID);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  flag = false;
  buttonClicked() {
    this.flag = !this.flag;
  }
  ingActive() {
    this.flag2 = true;
    this.flag3 = false;
    this.flag4 = false;
    this.flag6 = false;
    this.flag7 = false;
  }
  instActive() {
    this.flag3 = true;
    this.flag2 = false;
    this.flag4 = false;
    this.flag6 = false;
    this.flag7 = false;
  }
  summActive() {
    this.flag4 = true;
    this.flag2 = false;
    this.flag3 = false;
    this.flag6 = false;
    this.flag7 = false;
  }
  revActive() {
    this.flag6 = true;
    this.flag4 = false;
    this.flag2 = false;
    this.flag3 = false;
    this.flag7 = false;
  }
  nutActive() {
    this.flag7 = true;
    this.flag6 = false;
    this.flag4 = false;
    this.flag2 = false;
    this.flag3 = false;
  }
  back() {
    this._location.back();
  }
  toggleMeasure(value) {
    this.metricorus = value;
  }
  favoriteRecipes;
  addToFavorites() {
    console.log(this.recipeID);
    this._favoritesServices
      .addToFavorite(`favorites/add-recipe-to-favorite/${this.recipeID}`)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.favoriteRecipes = response['Data'];
          console.log(this.favoriteRecipes);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  removeFromFavorites() {
    console.log(this.recipeID);
    this._favoritesServices
      .removeFromFavorite(
        `favorites/remove-recipe-from-favorite/${this.recipeID}`
      )
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.favoriteRecipes = response['Data'];
          console.log(this.favoriteRecipes);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getUser(userID) {
    this.spinner.show();

    this._communityService.getUser(`user/get-user/${userID}`).subscribe(
      (response) => {
        this.spinner.hide();
        this.user = response['Data'];
        this.isSignIn = true;
        console.log('user:', this.user);
        if (this.user.favoriteRecipes.includes(this.recipeID)) {
          this.flagFav = true;
        }
        var found = false;
        for (var i = 0; i < this.user['ratedRecipes'].length; i++) {
          if (this.user['ratedRecipes'][i].recipe_id == this.recipeID) {
            this.ratedRecipe = this.user['ratedRecipes'][i].rate;
            console.log(this.ratedRecipe);
          }
        }
        console.log(this.flagFav);
      },
      (error) => { }
    );
  }
  createPost(title: string, content: string) {
    const image = `https://spoonacular.com/recipeImages/${this.recipeDetails.id}-636x393.jpg`;
    console.log(image);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('imageURL', image);
    this._communityService.createPost('post/create', formData).subscribe(
      (response) => {
        console.log('posts', response['Data']);

        this.user.posts.push(response['Data']);
        let successMessage = response['Message'];
        console.log(successMessage);
        this.shareToCommunityFlag = false;
      },
      (error) => {
        let errorMessage = error['error'].Error;
        console.log(errorMessage);
      }
    );
  }
  btnClicked() {
    this.shareToCommunityFlag = true;
  }
  stopSubmitting() {
    return false;
  }
  btnClickedFav() {
    this.favoriteButtonFlag = true;
    if (this.userID != null) {
      console.log('isclicked', this.isSignIn);
      this.getUser(this.userID);
      this.isSignIn = true;
      if (this.flagFav == true) {
        this.removeFromFavorites();
        this.flagFav = false;
        console.log(this.flagFav);
      } else {
        this.addToFavorites();
        this.flagFav = true;
        console.log(this.flagFav);
      }
    } else {
      this.isSignIn = false;
      console.log(this.userID);
    }
  }
  sendRate(event) {
    this.rateButtonFlag = true;
    if (this.userID) {
      console.log(event.target.value);

      let ratedRecipe;
      if (event.target.value == 5) {
        this.recipeRating.rating_5 = event.target.value;
        ratedRecipe = {
          recipe_id: this.recipeID,
          rate: 5,
        };
      } else if (event.target.value == 4) {
        this.recipeRating.rating_4 = event.target.value;
        ratedRecipe = {
          recipe_id: this.recipeID,
          rate: 4,
        };
      } else if (event.target.value == 3) {
        this.recipeRating.rating_3 = event.target.value;
        ratedRecipe = {
          recipe_id: this.recipeID,
          rate: 3,
        };
      } else if (event.target.value == 2) {
        this.recipeRating.rating_2 = event.target.value;
        ratedRecipe = {
          recipe_id: this.recipeID,
          rate: 2,
        };
      } else if (event.target.value == 1) {
        this.recipeRating.rating_1 = event.target.value;
        ratedRecipe = {
          recipe_id: this.recipeID,
          rate: 1,
        };
      }
      this.recipeRating.recipe_id = this.recipeID;
      this._ratingService
        .updateRating(
          `rating/update-recipe-rating/${this.recipeID}`,
          this.recipeRating
        )
        .subscribe(
          (response) => {
            console.log(response);
            this.flagdisable = true;
          },
          (error) => {
            console.log(error);
          }
        );
      this._favoritesServices
        .addRecipeToRated('favorites/add-rated-recipe', ratedRecipe)
        .subscribe(
          (response) => {
            console.log(response);
            event.preventDefault();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      event.preventDefault();
    }
  }
  addReview(review) {
    this.rateButtonFlag = true;
    console.log(review);
    this._ratingService
      .addReview(`rating/add-review/${this.recipeID}`, review)
      .subscribe(
        (response) => {
          console.log(response);
          this.ratingRecipe.comments.push(response['Data']);
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
