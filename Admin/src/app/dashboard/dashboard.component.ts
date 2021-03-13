import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { CommunityService } from './../services/community.service';
import { User } from './../models/user';
import { Posts } from './../models/posts';
import { PostContent } from './../models/postContent';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;

};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isResponsDone = false;
  users: User[] = [];
  posts: [] = [];
  comments: [] = [];

  favoritePostsLength = 0;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;

  constructor(private _communityService: CommunityService) {

  }



  ngOnInit() {


    // get all posts
    this._communityService.getAll('post/show').subscribe(
      response => {
        this.posts = response["Data"]
        console.log(this.posts)

      }
    )
    // get all comments
    this._communityService.getAll('post/get-comments').subscribe(
      response => {
        this.comments = response["Data"]
        console.log(this.comments)


      }
    )

    // get all users 
    this._communityService.getAll('user/show').subscribe(
      response => {
        this.users = response["Data"]

        console.log(this.users);

        // calaulate length of favorite posts 
        this.users.filter(user => {
          this.favoritePostsLength += user.favoritePosts.length
        })
        this.chartOptions = {
          series: [this.users.length, this.posts.length, this.comments.length],

          chart: {

            type: "pie"
          },
          // labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
          labels: ['Users', 'Posts', 'Comments'],

          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200

                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };

        this.chartOptions3 = {
          series: [this.posts.length, this.comments.length],

          chart: {

            type: "pie"
          },
          // labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
          labels: ['Posts', 'Comments'],

          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200

                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.chartOptions2 = {
          series: [this.users.length, this.posts.length],

          chart: {
            type: "pie"
          },
          labels: ['Users', 'Posts'],

          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200

                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.isResponsDone = true
      }
    )


  }

  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }


}
