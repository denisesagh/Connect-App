import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreatePostComponent} from "./component/createPost/create-post.component";
import {MatCardModule} from "@angular/material/card";
import {CommonModule, NgOptimizedImage} from "@angular/common";

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HotToastModule } from '@ngneat/hot-toast';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LogoutComponent } from './component/logout/logout.component';
import { FeedComponent } from './component/feed/feed.component';
import {getStorage, provideStorage} from "@angular/fire/storage";


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatMenuModule } from '@angular/material/menu';
import {SettingsComponent} from "./component/settings/settings.component";
import {CommentsComponent} from "./component/CommentsFeed/comments.component";
import { WriteCommentComponent } from './component/write-comment/write-comment.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import { LikeButtonComponent } from './component/like-button/like-button.component';
import { FriendlistComponent } from './component/friendlist/friendlist.component';
import { SearchbarComponent } from './component/searchbar/searchbar.component';
import {SearchfeedComponent} from "./component/searchFeed/searchfeed.component";
import { AdminComponent } from './component/admin/admin.component';
import { ExternProfileComponent } from './component/extern-profile/extern-profile.component';
import { NotificationsFeedComponent } from './component/notifications-feed/notifications-feed.component';
import firebase from "firebase/compat";
import firestore = firebase.firestore;



/* The `@NgModule` decorator is used to define a module in Angular. It is a metadata object that specifies how the module
should be compiled and run. */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreatePostComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    LogoutComponent,
    FeedComponent,
    SettingsComponent,
    CommentsComponent,
    WriteCommentComponent,
    LikeButtonComponent,
    FriendlistComponent,
    SearchbarComponent,
    SearchfeedComponent,
    AdminComponent,
    ExternProfileComponent,
    NotificationsFeedComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HotToastModule.forRoot({
      autoClose: true,
      duration: 2000,
    }),
    AngularFireStorageModule,
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    NgOptimizedImage,
    DialogModule,
    ButtonModule,


  ],
  providers: [FeedComponent, FriendlistComponent, ExternProfileComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
