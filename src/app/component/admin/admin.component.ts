import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/auth.service";
import {Subscription, switchMap} from "rxjs";
import {UsersService} from "../../Services/user/user.service";
import {Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";
import {
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {UserSettings} from "../../Model/UserSettings";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit{
  updateProfileForm = this.fb.group(
    {
      uid: ['', [Validators.required]],
      username: [''],
      bio: [''],
      fullName: [''],
    }
  );

  private defaultUserSettings: UserSettings[];
  public email: any;
  public username: any;
  public bio: any;
  public fullName: any;
  public uid: any;
  private updateUserSubscription: Subscription;
  private getUserSubscription: Subscription;



  /**
   * The constructor initializes various dependencies and sets default user settings.
   * @param {AuthService} auth - An instance of the AuthService class, which is responsible for handling
   * authentication-related tasks such as login, logout, and user registration.
   * @param {Router} router - The `router` parameter is an instance of the `Router` class, which is used for navigating
   * between different routes in an Angular application. It provides methods like `navigate`, `navigateByUrl`, and
   * `navigateByCommands` to navigate to different routes programmatically.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used
   * for displaying toast notifications in the application. Toast notifications are small pop-up messages that provide
   * feedback or information to the user.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with the user-related functionality, such as retrieving user information, updating user settings, etc.
   * @param {NonNullableFormBuilder} fb - The "fb" parameter is an instance of the NonNullableFormBuilder class. It is used
   * for creating and managing forms in Angular applications.
   */
  constructor(private auth:AuthService,
              private router: Router,
              private toast: HotToastService,
              private userService: UsersService,
              private fb: NonNullableFormBuilder
  ) {
    this.getUserSubscription = new Subscription();
    this.updateUserSubscription = new Subscription();
    this.defaultUserSettings = [
      {settingID: "receiveNotifications", settingValue: true}
    ];
  }

  ngOnInit(): void {
  }


  /* The `get` methods in the code are getter methods for accessing the form controls in the `updateProfileForm` form
  group. */
  get uidUpdate() {
    return this.updateProfileForm.get('uid');
  }

  get emailUpdate() {
    return this.updateProfileForm.get('email');
  }

  get usernameUpdate() {
    return this.updateProfileForm.get('username');
  }

  get bioUpdate() {
    return this.updateProfileForm.get('bio');
  }

  get fullNameUpdate() {
    return this.updateProfileForm.get('fullName');
  }


  /**
   * The `updateProfile()` function updates the user's profile information based on the values entered in the form fields.
   */
  updateProfile() {
    if(this.uidUpdate && this.uidUpdate.value){
      this.getUserSubscription = this.userService.getUserByID(this.uidUpdate.value).subscribe(
        (user) => {
          if (user) {

            if(this.usernameUpdate?.value){
              user.userName = this.usernameUpdate.value;
            }
            if(this.bioUpdate?.value){
              user.bio = this.bioUpdate.value;
            }
            if(this.fullNameUpdate?.value){
              user.fullName = this.fullNameUpdate.value;
            }
            this.updateUserSubscription = this.userService.updateUser(user).subscribe(
              () => {
                this.uidUpdate?.setValue("");
                this.toast.success("User updated");
                this.getUserSubscription.unsubscribe();
                this.updateUserSubscription.unsubscribe();
              });
          }
        });
    }
    else{
      this.toast.error("No user ID");
    }
  }
}
