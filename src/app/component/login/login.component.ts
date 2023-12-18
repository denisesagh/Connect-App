import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import {LogoutComponent} from "../logout/logout.component";
import {MatDialog} from "@angular/material/dialog";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public email: string;
  public password: string;

  /**
   * The constructor initializes private variables for AuthService, MatDialog, HotToastService, and Router, and sets the
   * email and password variables to empty strings.
   * @param {AuthService} auth - The `auth` parameter is an instance of the `AuthService` class. It is used for handling
   * authentication-related functionality, such as logging in and registering users.
   * @param {MatDialog} dialog - The `dialog` parameter is an instance of the `MatDialog` class, which is a service
   * provided by Angular Material. It is used to open dialog windows or modals in your application. Dialogs are used to
   * display important information or to prompt the user for input.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used to
   * display toast notifications in the application. Toast notifications are small pop-up messages that provide feedback or
   * information to the user.
   * @param {Router} router - The `router` parameter is an instance of the `Router` class from the Angular Router module.
   * It is used for navigating between different routes in your application.
   */
  constructor(private auth : AuthService,
              private dialog: MatDialog,
              private toast: HotToastService,
              private router: Router) {
    this.email = '';
    this.password = '';
  }




  /**
   * The login function checks if the email and password fields are empty, displays an alert if they are, and then calls
   * the login method of the auth service with the email and password values, displaying different toast messages based on
   * the login status, and navigating to the dashboard if the login is successful.
   * @returns In the given code, if either the email or password is empty, an alert message is displayed and the function
   * returns. If both the email and password are provided, the login process is initiated using the `auth.login()` method.
   * The `pipe()` function is used to handle the success, loading, and error messages using the `this.toast.observe()`
   * method. Finally, the `subscribe()` function is
   */
  public login():void {
    if(this.email == '') {
      alert('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    if(this.password == '') {
      alert('Bitte geben Sie Ihr Passwort ein');
      return;
    }

    this.auth
      .login(this.email, this.password)
      .pipe(
        this.toast.observe({
          success: 'Logged in',
          loading: 'Logging in...',
          error: ({ message }):string => `There was an error: ${message} `,
        })
      )
      .subscribe(():void => {
        this.router.navigate(['/dashboard']);
      });

  }


}
