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
  flag2 = false;
  recipeName: string;
  ingredients = [];
  recipesList: any = [];
  checked: boolean = false;
  isSingle: boolean = false;
  searchParam;
  arrayNutrients = [];
  filterQuery = new Map();
  search = '';
  number = 12;
  numberType = 12;
  numberIng = 12;
  filtersMultipleChoice = [
    {
      filterName: 'cuisine',
      filterValues: [
        'African',
        'American',
        'British',
        'Cajun',
        'Caribbean',
        'Chinese',
        'Eastern European',
        'European',
        'French',
        'German',
        'Greek',
        'Indian',
        'Irish',
        'Italian',
        'Japanese',
        'Korean',
        'Latin American',
        'Mediterranean',
        'Mexican',
        'Middle Eastern',
        'Nordic',
        'Southern',
        'Spanish',
        'Thai',
        'Vietnamese',
      ],
    },
    {
      filterName: 'intolerances',
      filterValues: [
        'Dairy',
        'Egg',
        'Gulten',
        'Grain',
        'Peanut',
        'Seafood',
        'Sesame',
        'Shellfish',
        'Soy',
        'Sulfite',
        'Tree Nut',
        'Wheat',
      ],
    },
  ];
  filtersSingleChoice = [
    {
      filterName: 'type',
      filterValues: [
        'main course',
        'side dish',
        'dessert',
        'appetizer',
        'salad',
        'bread',
        'breakfast',
        'soup',
        'beverage',
        'sauce',
        'marinade',
        'fingerfood',
        'snack',
        'drink',
      ],
    },
    {
      filterName: 'diet',
      filterValues: [
        'gluten free',
        'vegetarian',
        'lacto ovo vegetarian',
        'vegan',
        'pescatarian',
        'paleolithic',
        'primal',
        'dairy free',
        'whole30',
      ],
    },
  ];

  filterNutrition = {
    filterName: 'Nutrients',
    filterValues: [
      {
        filter: 'Carbs',
        ranges: ['10-28', '28-46', '46-64', '64-82', '82-100'],
      },
      {
        filter: 'Protein',
        ranges: ['10-28', '28-46', '46-64', '64-82', '82-100'],
      },
      {
        filter: 'Calories',
        ranges: ['50-200', '200-350', '350-500', '500-650', '650-800'],
      },
      {
        filter: 'Fat',
        ranges: ['1-20.8', '20.8-40.6', '40.6-60.4', '60.4-80.2', '80.2-100'],
      },
      {
        filter: 'Caffeine',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'SaturatedFat',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'VitaminA',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'VitaminC',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'VitaminB2',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'Iron',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filter: 'Sugar',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
    ],
  };

  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let prodName = params['searchName'];
      this.searchParam = params['searchName'];
      console.log('Reload');
      console.log(prodName);
      if (prodName == 'query') {
        prodName = 'pasta';
        this.searchParam = 'pasta';
        this.location.replaceState(
          `/kitchen/recipes/returned-list/${prodName}`
        );
      } else if (prodName == 'type') {
        prodName = 'type=breakfast';
        this.searchParam = 'type=breakfast';
        this.location.replaceState(
          `/kitchen/recipes/returned-list/${prodName}`
        );
      }
      this.search = 'Recipe name is ' + prodName + ' ';
      this.recipesList = [];
      this.ingredients = this.searchParam.split(',+');
      if (!prodName.includes('+')) {
        if (prodName.includes('=')) {
          console.log('include =');
          this.getInfoUsingTypes(prodName);
          let array = this.searchParam.split('=');
          this.filterQuery.set(array[0], array[1]);
        } else {
          this.getInfoUsingName(prodName);
          this.filterQuery.set('query', this.searchParam);
        }
      } else if (prodName.includes('+')) {
        this.getInfoUsingIngredients(prodName);
      }
    });
  }

  clickFilter() {
    this.flag = !this.flag;
  }

  onSubmit(recipeName: string) {
    this.spinner.show();
    this.recipesList = [];
    console.log(recipeName);
    if (this.checked == false) {
      this.ingredients = [];
      this.location.replaceState(
        `/kitchen/recipes/returned-list/${recipeName}`
      );
      this.spinner.hide();
      this.getInfoUsingName(recipeName);
      this.ingredients.push(recipeName);
    } else if (this.checked == true) {
      const query = this.ingredients.join(',+');
      console.log(query);
      this.location.replaceState(`/kitchen/recipes/returned-list/${query}`);
      this.getInfoUsingIngredients(query);
    }
  }

  save(event) {
    if (this.checked) {
      console.log('You entered: ', event.target.value);
      this.ingredients.push(event.target.value);
      console.log(this.ingredients);
      event.target.value = '';
      event.preventDefault();
    } else {
      console.log('Not checked');
    }
  }
  checkCheckBoxvalue(event) {
    this.checked = event.target.checked;
    this.ingredients = [];
    console.log(this.checked);
  }
  delete(index) {
    this.ingredients.splice(index, 1);
  }
  getInfoUsingName(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = 'The recipe name is ' + searchName;
    this.filterQuery;
    let apiKey = "&apiKey=ae9c1fc1e9bd48d896316a0627a03777"

    this._apiServices
      .get(
        `recipes/complexSearch?query=${searchName}&addRecipeInformation=true&number=${this.number}`, apiKey
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getInfoUsingIngredients(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = 'Ingredients for the recipes is ' + searchName;
    let apiKey = "&apiKey=ae9c1fc1e9bd48d896316a0627a03777"

    this._apiServices
      .get(
        `recipes/findByIngredients?ingredients=${searchName}&number=${this.numberIng}`, apiKey
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId;
          this.getMoreInfo(this.recipesList);
          console.log(responseId);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getInfoUsingTypes(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = searchName;
    console.log('Entered here', searchName);
    let apiKey = "&apiKey=66aef3f26f9b46d8be0fcc6d999fcb59"

    this._apiServices
      .get(
        `recipes/complexSearch?${searchName}&addRecipeInformation=true&number=${this.numberType}`, apiKey
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getMoreInfo(list: any[]) {
    this.spinner.show();
    this.recipesList = [];
    let apiKey = "&apiKey=265515485e5342db8f3ef41441dcc023"

    list.forEach((element) => {
      this._apiServices
        .get(`recipes/${element.id}/information?includeNutrition=false`, apiKey)
        .subscribe(
          (responseId) => {
            this.spinner.hide();
            this.recipesList.push(responseId);
            console.log(this.recipesList);
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }
  addFilterQuery(
    inputFilter: boolean,
    nameFilter: string,
    valueFilter: string
  ) {
    if (valueFilter.includes('-')) {
      this.arrayNutrients = valueFilter.split('-');
      console.log('min' + nameFilter);
      if (this.filterQuery.has(nameFilter)) {
        this.filterQuery.set('min' + nameFilter, this.arrayNutrients[0]);
        this.filterQuery.set('max' + nameFilter, this.arrayNutrients[1]);
      } else {
        this.filterQuery.set('min' + nameFilter, this.arrayNutrients[0]);
        this.filterQuery.set('max' + nameFilter, this.arrayNutrients[1]);
      }
      console.log(this.filterQuery);
    } else {
      console.log(inputFilter, nameFilter, valueFilter);
      if (inputFilter == true) {
        if (this.filterQuery.has(nameFilter)) {
          if (this.isSingle) {
            this.filterQuery.set(nameFilter, valueFilter);
            this.isSingle = false;
          } else {
            this.filterQuery.set(
              nameFilter,
              this.filterQuery.get(nameFilter) + ',' + valueFilter
            );
          }
        } else {
          this.filterQuery.set(nameFilter, valueFilter);
        }
        console.log(this.filterQuery);
      } else if (inputFilter == false) {
        let value = this.filterQuery.get(nameFilter);
        value = value.replace(',' + valueFilter, '');
        value = value.replace(valueFilter, '');
        this.filterQuery.set(nameFilter, value);
        console.log(this.filterQuery);
        console.log('here' + this.filterQuery.get(nameFilter));
        if (this.filterQuery.get(nameFilter) == '') {
          console.log('Here in delete filter name');
          this.filterQuery.delete(nameFilter);
        }
      }
    }
  }
  filterResults() {
    this.spinner.show();
    let query = '';
    let searchQuery = '';
    //console.log(query);
    this.search = '';
    this.filterQuery.forEach(function (value, key) {
      query = query + key + '=' + value + '&';
      let name = key;
      if (name == 'query') {
        name = 'The recipe name is';
      }
      searchQuery += name + ' is ' + value + ' ';
    });
    this.search = searchQuery;
    console.log(query);
    let apiKey = "&apiKey=58d2987051ff49ef9836801fa276cec8"

    this._apiServices
      .get(`recipes/complexSearch?addRecipeInformation=true&number=12&${query}`, apiKey)
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
        },
        (err) => {
          console.log(err);
        }
      );
    this.location.replaceState(`/kitchen/recipes/returned-list/${query}`);
  }
  more() {
    if (this.searchParam.includes('+')) {
      this.numberIng += 12;
      this.getInfoUsingIngredients(this.searchParam);
    } else {
      if (this.searchParam.includes('=')) {
        this.numberType += 12;
        this.getInfoUsingTypes(this.searchParam);
      } else {
        this.number += 12;
        this.getInfoUsingName(this.searchParam);
      }
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
