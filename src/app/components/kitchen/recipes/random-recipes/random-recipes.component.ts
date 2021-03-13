import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-random-recipes',
  templateUrl: './random-recipes.component.html',
  styleUrls: ['./random-recipes.component.scss'],
})
export class RandomRecipesComponent implements OnInit {
  randomRecipes;
  constructor(
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    let apiKey = "&apiKey=86975541261a434b8841262737615310"

    this.spinner.show();
    this._apiService.get('recipes/random?number=3', apiKey).subscribe(
      (response) => {
        this.spinner.hide();
        let random = Object.values(response);
        this.randomRecipes = random[0];
        console.log(this.randomRecipes);
      },
      (error) => {
        console.log(error);
      }
    );
  }
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
