import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UsersTableComponent } from '../../users-table/users-table.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { PostTableComponent } from './../../post-table/post-table.component';
import { PostDetailsComponent } from './../../post-details/post-details.component';
import { CommentDetailsComponent } from './../../comment-details/comment-details.component';
import { CommentTableComponent } from './../../comment-table/comment-table.component';
import { ContactTableComponent } from './../../contact-table/contact-table.component';



export const AdminLayoutRoutes: Routes = [

    { path: '', redirectTo: 'home' },
    { path: 'home', component: DashboardComponent },
    { path: 'users-table', component: UsersTableComponent },
    { path: 'user/:id', component: UserProfileComponent },
    { path: 'user/:id/details', component: UserProfileComponent },
    { path: 'posts-table', component: PostTableComponent },
    { path: 'post/:id', component: PostDetailsComponent },
    { path: 'post/:id/details', component: PostDetailsComponent },
    { path: 'comments-table', component: CommentTableComponent },
    { path: 'comment/:id', component: CommentDetailsComponent },
    { path: 'comment/:id/details', component: CommentDetailsComponent },
    { path: 'contact-table', component: ContactTableComponent },

    // { path: 'typography', component: TypographyComponent },
    // { path: 'icons', component: IconsComponent },
    // { path: 'notifications', component: NotificationsComponent },
    // { path: 'upgrade', component: UpgradeComponent },
    { path: '**', redirectTo: 'home' }
];

