import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './../../layout/header/header.component';
import { SharedModule } from '../../layout/shared.module';

@NgModule({
  declarations: [

  ],
  imports: [CommonModule, SharedModule],

  exports: [SharedModule]
})
export class HomeModule {

}
