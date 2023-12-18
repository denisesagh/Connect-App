import {Component, ViewChild} from '@angular/core';
import { Post} from "../../Model/Post";
import {MatDialog} from "@angular/material/dialog";
import {DbServiceService} from "../../Services/database/db-service.service";
import {AuthService} from "../../shared/auth.service";
import {UsersService} from "../../Services/user/user.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {ExternProfileComponent} from "../extern-profile/extern-profile.component";
@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DbServiceService]
})
export class DashboardComponent {

  @ViewChild(ExternProfileComponent) externProfileComponent!: ExternProfileComponent;
  public showFeed:boolean;
  public showProfile:boolean;
  public showCreatePost:boolean;
  public showSearch:boolean;
  public showSettings:boolean;
  public showComments:boolean;
  public showAdmin:boolean;
  public showExternProfile:boolean;
  public showNotificationFeed:boolean;
  public showAdminNav: boolean;
  public title: string;

  /**
   * This constructor initializes various boolean variables and sets the title to "Dashboard".
   * @param {MatDialog} dialog - The `dialog` parameter is an instance of the `MatDialog` class, which is a service
   * provided by Angular Material. It is used to open dialog windows or modals in your application.
   * @param {DbServiceService} firebaseStorageService - The `firebaseStorageService` parameter is an instance of the
   * `DbServiceService` class, which is responsible for interacting with the Firebase storage service. It likely provides
   * methods for uploading, downloading, and managing files in the Firebase storage.
   * @param {AuthService} auth - An instance of the AuthService class, which is responsible for handling
   * authentication-related functionality such as user login, registration, and logout.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with the user data in the application, such as retrieving user information, updating user profiles, and
   * managing user authentication.
   */
  constructor(private dialog: MatDialog, private firebaseStorageService: DbServiceService,
              private auth: AuthService, private userService: UsersService) {
    this.showFeed = true;
    this.showProfile = false;
    this.showCreatePost = false;
    this.showSearch = false;
    this.showSettings = false;
    this.showComments = false;
    this.showAdmin = false;
    this.showExternProfile = false;
    this.showNotificationFeed = false;
    this.showAdminNav = false;
    this.title = "Dashboard";
  }




  /**
   * The function sets various boolean flags based on the provided section parameter to control the visibility of different
   * sections in a web application.
   * @param {string} section - The "section" parameter is a string that represents the current section or page that the
   * user wants to open in the application.
   */
  async openBody(section: string): Promise<void> {
    this.showProfile = section == 'Profil';
    this.showFeed = section == 'Dashboard';
    this.showCreatePost = section == 'Post erstellen';
    this.showSearch = section == 'Suche';
    this.showSettings = section == 'Einstellungen';
    this.title = section;
    this.showExternProfile = section == 'Externes Profil';
    this.showComments = section == "CommentsFeed";
    this.showNotificationFeed = section == "Benachrichtigungen";
    this.showAdmin = section == "Admin";
    this.showAdminNav = await this.userService.checkAdminStatus();
  }



  protected readonly open = open;
}

