import { ApiService } from './../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  randomRecipes;
  checked: boolean;
  isDark = false;

  constructor(private _apiService: ApiService, public router: Router) { }

  ngOnInit(): void {
    // AOS.init();
    let apiKey = '&apiKey=9108c6ae9e864c39af9e61ee07d9827f';
    this._apiService.get('recipes/random?number=4', apiKey).subscribe(
      (response) => {
        let random = Object.values(response);
        this.randomRecipes = random[0];
        console.log(this.randomRecipes);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkCheckBoxvalue(event) {
    this.checked = event.target.checked;
    console.log(this.checked);
  }
  onSubmit(searchName: string) {
    if (this.checked == true) {
      this.router.navigate([`kitchen/ingredients/returned-list/${searchName}`]);
    } else {
      this.router.navigate([`kitchen/recipes/returned-list/${searchName}`]);
    }
  }
  test(recipe) {
    console.log(recipe);
  }
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
