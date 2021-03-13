import { ContactUsComponent } from './components/layout/contact-us/contact-us.component';
import { MainComponent } from './components/main/main.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: MainComponent },

  {
    path: 'kitchen',
    loadChildren: () =>
      import('../app/components/kitchen/kitchen.module').then(
        (m) => m.KitchenModule
      ),
  },
  {
    path: 'community',
    loadChildren: () =>
      import('../app/components/community/community.module').then(
        (m) => m.CommunityModule
      ),
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
