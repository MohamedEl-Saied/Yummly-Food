import { ContactUsComponent } from './../layout/contact-us/contact-us.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPostsComponent } from './show-posts/show-posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { GetPostComponent } from './get-post/get-post.component';
import { FavouritesPostsComponent } from './favourites-posts/favourites-posts.component';
import { RouterModule, Routes } from '@angular/router';
import { SignFormComponent } from './sign-form/sign-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../layout/shared.module';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UnAuthGuard } from 'src/app/guards/un-auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgxSpinnerModule } from 'ngx-spinner';
const routes: Routes = [
  {
    path: 'edit-post/:id',
    canActivate: [UnAuthGuard],
    component: EditPostComponent,
  },
  {
    path: 'profile/:id',
    canActivate: [UnAuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'search-results/:username',
    canActivate: [UnAuthGuard],
    component: SearchResultsComponent,
  },
  {
    path: 'edit-profile',
    canActivate: [UnAuthGuard],
    component: EditProfileComponent,
  },
  {
    path: 'favourites-posts',
    canActivate: [UnAuthGuard],
    component: FavouritesPostsComponent,
  },
  {
    path: 'get-post/:id',
    canActivate: [UnAuthGuard],
    component: GetPostComponent,
  },
  {
    path: 'show-posts',
    canActivate: [UnAuthGuard],
    component: ShowPostsComponent,
  },

  { path: '', canActivate: [AuthGuard], component: SignFormComponent },
  { path: '**', redirectTo: '/community' },
];

@NgModule({
  declarations: [
    ShowPostsComponent,
    EditPostComponent,
    GetPostComponent,
    FavouritesPostsComponent,
    SignFormComponent,
    ContactUsComponent,
    ProfileComponent,
    EditProfileComponent,
    SearchResultsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    NgxSpinnerModule,

  ],
  providers: [AuthGuard],
  exports: [],
})
export class CommunityModule { }
