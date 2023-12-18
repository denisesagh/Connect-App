import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/auth.service";
import {switchMap} from "rxjs";
import {UsersService} from "../../Services/user/user.service";
import {Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";
import {
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {UserSettings} from "../../Model/UserSettings";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  /* The code `public signUpForm:FormGroup = this.fb.group({...})` is creating an instance of the `FormGroup` class and
  assigning it to the `signUpForm` property of the `RegisterComponent` class. */
  public signUpForm:FormGroup = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    }
  );


  private defaultUserSettings: UserSettings[];

  /**
   * The constructor function initializes various services and sets a default user setting.
   * @param {AuthService} auth - AuthService - This is a service that handles authentication and user login/logout
   * functionality.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with the user-related functionality, such as retrieving user information, updating user settings, etc.
   * @param {Router} router - The `router` parameter is an instance of the `Router` class from the Angular Router module.
   * It is used for navigating between different routes in your application.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used
   * for displaying toast notifications in the application. Toast notifications are small pop-up messages that provide
   * feedback or information to the user.
   * @param {UsersService} user - The "user" parameter is an instance of the UsersService class. It is used to interact
   * with user-related data and perform operations such as fetching user details, updating user information, etc.
   * @param {NonNullableFormBuilder} fb - The "fb" parameter is an instance of the NonNullableFormBuilder class. It is used
   * for creating and managing forms in Angular applications.
   */
  constructor(private auth:AuthService,
              private userService: UsersService,
              public router: Router,
              public toast: HotToastService,
              private user: UsersService,
              private fb: NonNullableFormBuilder
              )
  {
    this.defaultUserSettings = [
      {settingID: "receiveNotifications", settingValue: true}
    ];
  }

  /* The `get email()`, `get password()`, and `get name()` functions are getter methods that are used to access the form
  controls in the `signUpForm` FormGroup. */
  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }


  get name() {
    return this.signUpForm.get('name');
  }


  /**
   * The `setProfileFormTest` function is used to set the values of the `signUpForm` FormGroup. This function is used for
   * testing purposes only.
   */
  setProfileFormTest():void{
    this.signUpForm.setValue({
      name: 'test',
      email: 'testmail@gmail.com',
      password: 'test1234'
    });
  }


  /**
   * The `register` function handles the registration process by validating the form inputs, registering the user with the
   * provided email and password, adding the user to the database, and displaying appropriate toast messages.
   * @returns The function `register()` does not have a return type specified, so it is returning `void`.
   */
  register():void {
    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !name || !password || !email) {
      this.toast.error('Please fill out all the fields');
      return;
    }
    this.auth
      .register(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.user.addUser({ uid, email, userName: name, admin: false, settings:this.defaultUserSettings, iAmFollowing:[], myFollower:[]})
        ),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

}
