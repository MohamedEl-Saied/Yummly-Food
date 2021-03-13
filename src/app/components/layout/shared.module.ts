import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [HeaderComponent, ChatbotComponent, FooterComponent],
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, HeaderComponent, ChatbotComponent, FooterComponent],
})
export class SharedModule {}
