import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  randomRecipes;
  checked: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  onSubmit(ingredientName: string) {
    this.router.navigate([
      `kitchen/ingredients/returned-list/${ingredientName}`,
    ]);
  }
}
