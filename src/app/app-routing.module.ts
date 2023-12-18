import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import {ProfileComponent} from "./component/profile/profile.component";
import {LogoutComponent} from "./component/logout/logout.component";
import {SettingsComponent} from "./component/settings/settings.component";
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {CommentsComponent} from "./component/CommentsFeed/comments.component";
import {WriteCommentComponent} from "./component/write-comment/write-comment.component";
import {LikeButtonComponent} from "./component/like-button/like-button.component";
import {FriendlistComponent} from "./component/friendlist/friendlist.component";
import {SearchfeedComponent} from "./component/searchFeed/searchfeed.component";
import {SearchbarComponent} from "./component/searchbar/searchbar.component";
import {NotificationsFeedComponent} from "./component/notifications-feed/notifications-feed.component";


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/dashboard']);


const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},

  {path: 'login', component : LoginComponent,
    ...canActivate(redirectLoggedInToHome)},
  {path: 'dashboard', component : DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),},
  {path: 'register', component : RegisterComponent},
  {path: 'forgot-password', component : ForgotPasswordComponent},
  {path: 'profile',
    component : ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin)},
  {path: 'logout', component : LogoutComponent},
  {path: 'settings', component : SettingsComponent},
  {path: 'comments', component : CommentsComponent},
  {path: 'writeComment', component: WriteCommentComponent},
  {path: 'likeButton', component: LikeButtonComponent},
  {path: 'friendlist', component: FriendlistComponent},
  {path: 'search-feed', component: SearchfeedComponent},
  {path: 'search-bar', component: SearchbarComponent},
  {path: 'notifications', component: NotificationsFeedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
  }


}
