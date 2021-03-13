import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss'],
})
export class MealPlanComponent implements OnInit {
  constructor(
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) { }
  planRecipes;
  planRecipesDetails = [];
  ngOnInit(): void {
    this.spinner.show();
    let apiKey = "&apiKey=62482d53c54e4f75b718a096750b53af"

    this._apiService
      .get('/mealplanner/generate?timeFrame=day&addRecipeInformation=true', apiKey)
      .subscribe(
        (response) => {
          let random = Object.values(response);
          // this.planRecipes = random[0];
          this.planRecipes = response;
          console.log(this.planRecipes);
          this.getResults();
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getResults = () => {
    let apiKey = "&apiKey=62482d53c54e4f75b718a096750b53af";

    for (let res of this.planRecipes.meals) {
      this._apiService.get(`recipes/${res.id}/information?amount=1`, apiKey).subscribe(
        (responseInfo) => {
          console.log(responseInfo);
          this.planRecipesDetails.push(responseInfo);
          console.log(this.planRecipesDetails);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  refresh() {
    this.ngOnInit();
  }
  back() {
    this._location.back();
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
