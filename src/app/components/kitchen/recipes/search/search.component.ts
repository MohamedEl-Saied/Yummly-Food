import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  flag = false;
  flag2 = false;
  recipeName: string;
  ingredients = [];
  checked: boolean = false;
  searchParam;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  save(event) {
    if (this.checked) {
      console.log('You entered: ', event.target.value);
      this.ingredients.push(event.target.value);
      console.log(this.ingredients);
      event.target.value = '';
    } else {
      console.log('Not checked');
    }
  }

  checkCheckBoxvalue(event) {
    this.checked = event.target.checked;
    console.log(this.checked);
  }
  delete(index) {
    this.ingredients.splice(index, 1);
  }
  onSubmit(recipeName: string) {
    console.log(recipeName);
    if (this.checked == false) {
      this.ingredients = [];
      this.router.navigate([`kitchen/recipes/returned-list/${recipeName}`]);
    } else if (this.checked == true) {
      const query = this.ingredients.join(',+');
      console.log(query);
      this.router.navigate([`kitchen/recipes/returned-list/${query}`]);
    }
  }
}
