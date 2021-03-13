import { Component, OnInit } from '@angular/core';

declare const index2: Function;
declare const index3: Function;
declare const index4: Function;
declare const index5: Function;


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isLoaded = false;
  constructor() {

  }

  ngOnInit(): void {

    setTimeout(() => {
      this.isLoaded = true;
    }, 4500);

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.isLoaded = true;
      index2();
      index3();
      index4();
      index5();
    }, 4500);

  }


}
