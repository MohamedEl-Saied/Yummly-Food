import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReturnedListComponent } from './returned-list/returned-list.component';
import { RandomRecipesComponent } from './random-recipes/random-recipes.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { SharedModule } from '../../layout/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { NgApexchartsModule } from 'ng-apexcharts';

const routes: Routes = [
  { path: 'recipes/search', component: SearchComponent },
  {
    path: 'recipes/returned-list/:searchName',
    component: ReturnedListComponent,
  },
  {
    path: 'recipes/recipe-details/:id/information',
    component: RecipeDetailsComponent,
  },
  {
    path: 'recipes/explore-all-random-recipes',
    component: RandomRecipesComponent,
  },
  { path: 'recipes/plan-meal', component: MealPlanComponent },
  { path: 'recipes/favorite-recipes', component: FavoriteRecipesComponent },
];

@NgModule({
  declarations: [
    SearchComponent,
    RecipeDetailsComponent,
    ReturnedListComponent,
    RandomRecipesComponent,
    MealPlanComponent,
    FavoriteRecipesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    NgApexchartsModule,
  ],
  exports: [SharedModule],
})
export class RecipesModule {}
