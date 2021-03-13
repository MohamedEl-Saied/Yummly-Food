import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-returned-list',
  templateUrl: './returned-list.component.html',
  styleUrls: ['./returned-list.component.scss'],
})
export class ReturnedListComponent implements OnInit {
  flag = false;
  ingredients = null;
  ingredientDetails = [];
  searchParam;
  isReadMoreClicked = null;
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
    this.spinner.show();
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
    let apiKey1 = '&apiKey=1535a0d0d6de4cdab95490ad4891a2b5';

    this._apiServices
      .get(`food/ingredients/search?query=${this.ingredientName}`, apiKey1)
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
    let apiKey2 = '&apiKey=551e91b6bbc247fc94deae528ab14117';

    for (let res of this.ingredients.results) {
      this._apiServices
        .get(`food/ingredients/${res.id}/information?amount=1&`, apiKey2)
        .subscribe(
          (responseInfo) => {
            this.spinner.hide();
            console.log(responseInfo);
            this.ingredientDetails.push(responseInfo);
            console.log(this.ingredientDetails);
            console.log(this.ingredientDetails[0][`nutrition`]);
          },
          (err) => {
            this.spinner.show();
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
