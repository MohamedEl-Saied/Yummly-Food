import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UsersTableComponent } from '../../users-table/users-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { MatCardModule } from '@angular/material/card';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { PostTableComponent } from 'app/post-table/post-table.component';
import { PostDetailsComponent } from 'app/post-details/post-details.component';
import { CommentTableComponent } from 'app/comment-table/comment-table.component';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommentDetailsComponent } from 'app/comment-details/comment-details.component';
import { ContactTableComponent } from 'app/contact-table/contact-table.component';

@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
    MatCardModule,
    MatCheckboxModule
  ],
  declarations: [
    DashboardComponent,
    UsersTableComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,
    PostTableComponent,
    PostDetailsComponent,
    CommentTableComponent,
    CommentDetailsComponent,
    ContactTableComponent,

  ],
  exports: [

  ]
})

export class AdminLayoutModule { }
