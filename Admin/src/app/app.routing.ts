import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { UnAuthGuard } from './guards/un-auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // }, 
  { path: '', canActivate: [AuthGuard], component: SignInComponent },
  {
    path: 'dashboard',
    canActivate: [UnAuthGuard],
    component: AdminLayoutComponent,
    children: [{
      path: '',

      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [

    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
