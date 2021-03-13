import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  flag = false;
  ingredients = null;
  ingredientDetails = [];
  searchParam;
  isReadMoreClicked = false;
  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxSpinnerService
  ) { }
  ingredientName: string;

  showMyContainer: boolean = false;

  onSubmit(ingredient) {
    this.ingredientName = ingredient;
    this.getAllIngredients();
  }

  ngOnInit(): void {
    // this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      this.ingredientName = params['searchName'];
      this.searchParam = params['searchName'];
      console.log('Reload');
      this.getAllIngredients();
    });
  }

  clickFilter() {
    console.log(this.flag);
    this.flag = !this.flag;
    console.log(this.flag);
    // var app = angular.module('myApp', ['ngAnimate']);
  }

  getAllIngredients() {
    this.ingredientDetails = [];
    console.log(this.ingredientName);
    this.location.replaceState(
      `/kitchen/ingredients/returned-list/${this.ingredientName}`
    );
    this._apiServices
      .get(`food/ingredients/search?query=${this.ingredientName}&`)
      .subscribe(
        (responseId) => {
          this.ingredients = responseId;
          console.log(this.ingredients);
          this.getResults();
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getResults = () => {
    for (let res of this.ingredients.results) {
      this._apiServices
        .get(`food/ingredients/${res.id}/information?amount=1&`)
        .subscribe(
          (responseInfo) => {
            this.spinner.hide();
            console.log(responseInfo);
            this.ingredientDetails.push(responseInfo);
            console.log(this.ingredientDetails);
            console.log(this.ingredientDetails[0][`nutrition`]);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  };
  c;
  open_close(currentIndex) {
    if (this.c != currentIndex) {
      this.c = currentIndex;
    } else {
      this.c = null;
    }
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
