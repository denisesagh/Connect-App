import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  public email : string;


  /**
   * The constructor initializes the email property and injects the AuthService dependency.
   * @param {AuthService} authService - The `authService` parameter is of type `AuthService`. It is a dependency that is
   * injected into the constructor of the class. This allows the class to access and use the methods and properties of the
   * `AuthService` class.
   */
  constructor(private authService: AuthService) {
    this.email = '';
  }

  /**
   * The `forgotPassword` function calls the `forgotPassword` method of the `authService` and clears the `email` field.
   */
  public forgotPassword():void{
    this.authService.forgotPassword(this.email);
    this.email = '';
  }

}
