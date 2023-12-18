import {Injectable} from '@angular/core';
import {from, map, Observable, of, Subscriber, Subscription} from "rxjs";
import {Benachrichtigung} from "../../Model/Benachrichtigung";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Database} from "@angular/fire/database";
import {getDatabase, onValue, ref} from "firebase/database";
import {UsersService} from "../user/user.service";
import {UserSettings} from "../../Model/UserSettings";
import {ProfileUser} from "../../Model/User";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationStatus: boolean;
  private notificationSatusSubscription: Subscription;


  /**
   * The constructor initializes the notificationSatusSubscription and notificationStatus variables.
   * @param {AngularFireDatabase} db - The "db" parameter is of type "AngularFireDatabase" and is used to interact with the
   * Firebase Realtime Database. It allows you to perform CRUD (Create, Read, Update, Delete) operations on the database.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with user-related data and perform operations such as fetching user information, updating user details,
   * etc.
   */
  constructor(private db:AngularFireDatabase, private userService: UsersService) {
    this.notificationSatusSubscription = new Subscription();
    this.notificationStatus = true;

  }

  /**
   * The ngOnDestroy function unsubscribes from a notification status subscription.
   */
  ngOnDestroy():void{
    this.notificationSatusSubscription.unsubscribe();
  }

  /**
   * The function retrieves the notification settings for a user and assigns the first setting value to the
   * notificationStatus variable.
   * @param {string} userID - The userID parameter is a string that represents the unique identifier of a user.
   */
  private getUserNotificationSettings(userID: string):void{
    this.notificationSatusSubscription = this.userService.getUserByID(userID).subscribe((user:ProfileUser | null):void => {
      if (user && user.settings) {
        const firstSetting:UserSettings = user.settings[0];
        this.notificationStatus = firstSetting.settingValue;
      }
    });
  }

  /**
   * The function saves a notification object to the database if the user's notification settings are enabled, otherwise it
   * returns null.
   * @param {Benachrichtigung} notification - The `notification` parameter is an object of type `Benachrichtigung` which
   * contains the details of the notification to be saved. It has the following properties:
   * @param {string} userID - The `userID` parameter is a string that represents the user's ID. It is used to identify the
   * user for whom the notification is being saved.
   * @returns The function `saveNotification` returns an Observable of type `Benachrichtigung` if the notification status
   * is true. If the notification status is false, it returns an Observable of type `null`.
   */
  public saveNotification(notification: Benachrichtigung, userID:string): Observable<Benachrichtigung>|Observable<null> {
    this.getUserNotificationSettings(userID);
    if (!this.notificationStatus){
      return of(null);
    }
    return from(this.db.object('/notifications/'+notification.userID + "/" + notification.notificationID).set({
      userID: notification.userID,
      postID: notification.postID,
      type: notification.type,
      date: notification.date,
      formattedDate: notification.formattedDate
    })).pipe(
      map(() => notification)
    );
  }

  /**
   * The function creates a notification object with the given parameters.
   * @param {string} userID - The userID parameter is a string that represents the user ID of the recipient of the
   * notification.
   * @param {string} postID - The postID parameter is a string that represents the ID of the post for which the
   * notification is being created.
   * @param {string} notificationID - The `notificationID` parameter is a unique identifier for the notification. It can be
   * a string or a number, depending on how you want to implement it.
   * @param {string} type - The "type" parameter is a string that represents the type of notification. It could be
   * something like "like", "comment", "follow", etc.
   * @param {number} date - The `date` parameter is a number representing the timestamp of the notification. It can be
   * obtained using the `Date.now()` method, which returns the number of milliseconds since January 1, 1970, 00:00:00 UTC.
   * @param {string} formattedDate - The `formattedDate` parameter is a string that represents the date in a specific
   * format. It is used to display the date in a user-friendly way, such as "January 1, 2022" or "01/01/2022".
   * @returns a notification object with the properties userID, postID, notificationID, type, date, and formattedDate.
   */
  public createNotification(userID:string, postID:string,notificationID:string, type: string, date:number, formattedDate:string): Benachrichtigung{
    return {
      userID: userID,
      postID: postID,
      notificationID: notificationID,
      type: type,
      date: date,
      formattedDate:formattedDate
    };
  }

  /**
   * The function retrieves all notifications for a given user ID from a database and returns them as an observable array.
   * @param {string} userID - The userID parameter is a string that represents the unique identifier of a user. It is used
   * to retrieve all notifications associated with that user from the database.
   * @returns an Observable of type `Benachrichtigung[]`.
   */
  public getAllNotificationsByUserID(userID: string): Observable<Benachrichtigung[]> {
    const db: Database = getDatabase();
    const reference = ref(db, '/notifications/' + userID);

    return new Observable<Benachrichtigung[]>((observer:Subscriber<Benachrichtigung[]>):void => {
      onValue(reference, (snapshot):void => {
        const notifications: Benachrichtigung[] = [];
        snapshot.forEach((childSnapshot):void => {
          const data = childSnapshot.val();
          const notification: Benachrichtigung = {
            userID: data.userID,
            postID: data.postID,
            type: data.type,
            date: data.date,
            formattedDate: data.formattedDate,
            notificationID: data.notificationID
          };
          notifications.push(notification);
        });
        notifications.sort((a:Benachrichtigung, b:Benachrichtigung) => new Date(b.date).getTime() - new Date(a.date).getTime());
        observer.next(notifications);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }

  /**
   * The function deletes all notifications for a given user ID from the database.
   * @param {string} userID - The userID parameter is a string that represents the unique identifier of the user for whom
   * you want to delete all notifications.
   * @returns an Observable that will emit the result of deleting all notifications for a given userID.
   */
  public deleteAllNotifications(userID: string): Observable<any> {
    return from(this.db.list('/notifications', ref =>
      ref.orderByChild('userID').equalTo(userID)
    ).remove());
  }

}
