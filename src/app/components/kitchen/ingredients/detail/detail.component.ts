import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from './../../../../services/api.service';
import { Component, OnInit } from '@angular/core';
declare const detailIngredients: Function;


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  ingredients = null;
  ingredientDetails: any;
  searchParams;

  constructor(private _apiServices: ApiService, private route: ActivatedRoute,

  ) { }


  ngOnInit(): void {
    detailIngredients();
    this.route.params.subscribe((params: Params) => {
      this.searchParams = params["id"]
      this.getResults();
    });
  }
  getResults = () => {
    // this.spinner.show();
    let apiKey = '&apiKey=c973a070e9e0471fa25a63ee8f79c975';

    this._apiServices
      .get(`food/ingredients/${this.searchParams}/information?amount=1&`, apiKey)
      .subscribe(
        (responseInfo) => {
          // this.spinner.hide();
          this.ingredientDetails = responseInfo;
        },
        (err) => {
          console.log(err);
        }
      );
  };


  ngAfterViewInit() {
    detailIngredients();
    console.log(detailIngredients);
  }
}
