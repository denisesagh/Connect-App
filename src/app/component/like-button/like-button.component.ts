import {Component, Input} from '@angular/core';
import {DbServiceService} from "../../Services/database/db-service.service";
import {UsersService} from "../../Services/user/user.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../../Services/notifications/notification.service";
import {Benachrichtigung} from "../../Model/Benachrichtigung";
import {v4 as uuid} from "uuid";
import {ProfileUser} from "../../Model/User";

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent {

  @Input() postID: string;
  @Input() postUserID: string;
  @Input() buttonStatus: boolean | undefined;

  public userID: string;
  private currentProfileSubscription: Subscription;


  /**
   * The ngOnInit function subscribes to the currentUserProfile$ observable and assigns the user's uid to the userID
   * property if it exists.
   */
  ngOnInit():void {
    this.currentProfileSubscription = this.userService.currentUserProfile$
      .subscribe((user:ProfileUser|null):void => {
        if (user?.uid){
          this.userID = user.uid;
        }
      });
  }

  /**
   * The constructor initializes various services and sets initial values for variables used in the class.
   * @param {DbServiceService} firebaseStorageService - This parameter is of type `DbServiceService` and is used to
   * interact with the Firebase storage service. It likely provides methods for uploading, downloading, and managing files
   * in the Firebase storage.
   * @param {NotificationService} notificationService - The `notificationService` parameter is an instance of the
   * `NotificationService` class. It is used to handle notifications in the application.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with user-related data and perform operations such as fetching user information, updating user details,
   * etc.
   */
  constructor(private firebaseStorageService: DbServiceService,
              private notificationService: NotificationService,
              private userService: UsersService) {
    this.currentProfileSubscription = new Subscription();
    this.buttonStatus = false;
    this.postID = "";
    this.userID = "";
    this.postUserID = "";
  }

  /**
   * The function `likePost` allows a user to like or unlike a post, and it also creates and saves a notification for the
   * action.
   */
  public likePost():void{
    let postDate: number = Date.now();
    let formattedDate: string = new Date(postDate)
      .toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

    if (this.buttonStatus){
      this.firebaseStorageService.removeLikeOfPost(this.postID, this.userID);
      const newNotification:Benachrichtigung = this.notificationService.createNotification(this.postUserID, this.postID, uuid(), "Unlike", postDate, formattedDate);
      this.notificationService.saveNotification(newNotification, this.postUserID)
      this.buttonStatus = false;  // Setzen isLiked auf false
    }else {
      this.firebaseStorageService.addLikesToPost(this.postID, this.userID);
      console.log("Wie siehts aus: " + this.postUserID + " " + this.userID);
      const newNotification:Benachrichtigung = this.notificationService.createNotification(this.postUserID, this.postID, uuid(),"Like", postDate, formattedDate);
      this.notificationService.saveNotification(newNotification, this.postUserID)
      this.buttonStatus = true;   // Setzen isLiked auf true
    }
  }

  /**
   * The ngOnDestroy function unsubscribes from a subscription to the current profile.
   */
  ngOnDestroy(): void {
    this.currentProfileSubscription.unsubscribe();
  }

}
