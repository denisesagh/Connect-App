import {Component} from '@angular/core';
import {UsersService} from "../../Services/user/user.service";
import {UserSettings} from "../../Model/UserSettings";
import {Subscription, tap} from "rxjs";
import {AuthService} from "../../shared/auth.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  public settings: UserSettings[];
  private uid: string;
  private currenUserSubscription: Subscription;
  private currentUserSettingsSubscription: Subscription;

  /**
   * This constructor initializes various services and subscriptions, and sets the uid property based on the current user's
   * profile.
   * @param {UsersService} userService - The userService parameter is an instance of the UsersService class, which is
   * responsible for handling user-related operations such as fetching user profiles and updating user information.
   * @param {AuthService} auth - The `auth` parameter is an instance of the `AuthService` class. It is used for
   * authentication-related operations such as login, logout, and user registration.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used
   * for displaying toast notifications in the application. Toast notifications are small pop-up messages that provide
   * feedback or information to the user.
   * @param {Router} router - The `router` parameter is an instance of the `Router` class, which is used for navigating
   * between different routes in an Angular application. It provides methods like `navigate`, `navigateByUrl`, and
   * `navigateByCommands` to navigate to different routes programmatically.
   * @param {UsersService} usersService - The `usersService` parameter is an instance of the `UsersService` class, which is
   * responsible for handling user-related operations such as fetching user profiles and updating user settings.
   */
  constructor(private userService: UsersService, private auth: AuthService,
              private toast: HotToastService, private router: Router, private usersService: UsersService) {

    this.currentUserSettingsSubscription = new Subscription();
    this.settings = [];
    this.uid = "";

    this.currenUserSubscription= this.usersService.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user) => {
        this.uid = user.uid;
      });
  }

  /**
   * The ngOnInit function subscribes to the currentUserSettings$ observable and assigns the received settings to the
   * component's settings property.
   */
  ngOnInit():void {
    this.currentUserSettingsSubscription = this.userService.currentUserSettings$.subscribe((settings: UserSettings[] | null):void => {
      if (settings && settings.length > 0) {
        this.settings = [];
        console.log("Current settings:" + this.settings);
        settings.forEach((userSetting:UserSettings):void => {
          this.settings.push({settingID: userSetting.settingID, settingValue: userSetting.settingValue});
        });
      }
    });
  }


  /**
   * The function updates a user's setting value based on a changed setting and saves the updated settings to the database.
   * @param {UserSettings} changedSetting - The parameter "changedSetting" is of type "UserSettings".
   */
  public onSwitchChanged(changedSetting: UserSettings): void {
    //Such nach der Einstellung im Array und dreht den Zustand
    const index: number = this.settings.findIndex((s:UserSettings):boolean => s.settingID === changedSetting.settingID);
    if (index != -1) {
      this.settings[index].settingValue = !this.settings[index].settingValue;
    }

    //Safe to DB
    this.userService.updateUser({
      uid: this.uid,
      settings: this.settings
    })
    this.currenUserSubscription.unsubscribe();
    this.currentUserSettingsSubscription.unsubscribe()

}

  /**
   * The `logout` function logs the user out, displays a toast message indicating the status of the logout process, and
   * redirects the user to the login page.
   */
  logout(): void {
    this.auth.logout()
      .pipe(
        this.toast.observe({
          success: 'Logged out',
          loading: 'Logging out...',
          error: ({message}):string => `There was an error: ${message} `,
        }),
      ).subscribe(():void => {
      this.router.navigate(['/login']).then(
        ():void => {
          window.location.reload();
        }
      );
    });
  }

  /**
   * The deleteUser function calls the deleteUser method from the auth object.
   */
  public deleteUser(){
    this.auth.deleteUser();
  }

  /**
   * The ngOnDestroy function is used to unsubscribe from subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.currenUserSubscription.unsubscribe();
    this.currentUserSettingsSubscription.unsubscribe()
  }
}
