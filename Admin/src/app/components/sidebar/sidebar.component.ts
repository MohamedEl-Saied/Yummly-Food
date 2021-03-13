import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: 'users-table', title: 'Users Table', icon: 'people', class: '' },
  { path: 'posts-table', title: 'Posts Table', icon: 'article', class: '' },
  { path: 'comments-table', title: 'Comments Table', icon: 'comment', class: '' },
  { path: 'contact-table', title: 'Contact Table', icon: 'email', class: '' },





];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
