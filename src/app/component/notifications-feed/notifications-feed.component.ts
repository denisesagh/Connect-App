import { Component } from '@angular/core';
import {Observable, Subscription, tap} from "rxjs";
import {Benachrichtigung} from "../../Model/Benachrichtigung";
import {NotificationService} from "../../Services/notifications/notification.service";
import {UsersService} from "../../Services/user/user.service";
import {ProfileUser} from "../../Model/User";

@Component({
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.css']
})
export class NotificationsFeedComponent {

  public notifications: Observable<Benachrichtigung[]>;
  public userID: string;

  private currentUserSubscription: Subscription;

  /**
   * The constructor initializes the notification service, user service, notifications array, current user subscription,
   * and user ID.
   * @param {NotificationService} notificationService - The `notificationService` parameter is an instance of the
   * `NotificationService` class. It is used to handle notifications in the application.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with user-related data and perform operations such as fetching user information, updating user details,
   * etc.
   */
  constructor(private notificationService: NotificationService, private userService: UsersService) {
    this.notifications = new Observable<Benachrichtigung[]>;
    this.currentUserSubscription = new Subscription();
    this.userID = "";
  }

  /**
   * The ngOnInit function subscribes to the currentUserProfile$ observable and sets the userID and notifications based on
   * the user's profile.
   */
  ngOnInit():void{
    this.currentUserSubscription = this.userService.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user:ProfileUser):void => {
        this.userID = user.uid;
        this.notifications = this.notificationService.getAllNotificationsByUserID(this.userID);
      });
  }

  /**
   * The ngOnDestroy function unsubscribes from a subscription and deletes all notifications for the current user.
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.notificationService.deleteAllNotifications(this.userID);
  }
}
