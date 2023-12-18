import {Component, EventEmitter, Output} from '@angular/core';
import {DbServiceService} from "../../Services/database/db-service.service";
import {Subscription, tap} from "rxjs";
import {CommentI} from "../../Model/Comment";
import {UsersService} from "../../Services/user/user.service";
import {v4 as uuid} from "uuid";
import {Benachrichtigung} from "../../Model/Benachrichtigung";
import {NotificationService} from "../../Services/notifications/notification.service";
import {ProfileUser} from "../../Model/User";

@Component({
  selector: 'app-write-comment',
  templateUrl: './write-comment.component.html',
  styleUrls: ['./write-comment.component.css']
})
export class WriteCommentComponent {

  public commentText: string;
  public visible:boolean;

  private readonly postID:string;
  private postUserID:string;
  private uid: string;
  private username:string;
  @Output() close:EventEmitter<void>;

  currentUserSubscription: Subscription;

  /**
   * This constructor initializes various properties and subscribes to the currentUserProfile$ observable to get the
   * current user's information.
   * @param {DbServiceService} firebaseStorageService - The `firebaseStorageService` parameter is an instance of the
   * `DbServiceService` class, which is responsible for interacting with the Firebase storage service. It likely provides
   * methods for uploading, downloading, and managing files in the Firebase storage.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class, which is
   * responsible for managing user-related operations such as retrieving user profiles and updating user information.
   * @param {NotificationService} notificationService - The `notificationService` parameter is an instance of the
   * `NotificationService` class. It is used to handle notifications in the application.
   */
  constructor(private firebaseStorageService: DbServiceService, private userService: UsersService, private notificationService: NotificationService) {

    this.close = new EventEmitter<void>();
    this.postID = "";
    this.uid = "";
    this.postUserID = "";
    this.commentText = "";
    this.username = "";
    this.visible = true;


    this.currentUserSubscription = this.userService.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user:ProfileUser):void => {
        this.uid = user.uid;
        if (user.userName)
        this.username = user.userName;
      });

    const localStoragePostID: string|null = localStorage.getItem('postID' );
    const localStoragePostUserID: string|null = localStorage.getItem('postUserID');
    localStorage.removeItem('postID');
    localStorage.removeItem('postUserID')
    if (localStoragePostID && localStoragePostUserID){
      this.postID = localStoragePostID;
      this.postUserID = localStoragePostUserID;
    }

  }

  /**
   * The function `onUploadButtonPressed` uploads a comment to a post, creates a notification for the post owner, and
   * closes a dialog.
   */
  public onUploadButtonPressed():void{
    let postDate: number = Date.now();
    let formattedDate: string = new Date(postDate)
      .toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

    const newComment: CommentI = {commentID: uuid(), userID: this.uid, username: this.username, commentText: this.commentText, postDate: postDate, formatedPostDate: formattedDate};

    if (newComment.commentText != ""){
      this.firebaseStorageService.uploadCommentToPost(this.postID,newComment);
      const newNotification:Benachrichtigung = this.notificationService.createNotification(this.postUserID, this.postID, uuid(),"Kommentar", postDate, formattedDate);
      this.notificationService.saveNotification(newNotification, this.postUserID);
      this.closeDialog();
      console.log(this.currentUserSubscription)
      this.currentUserSubscription.unsubscribe();
    }
  }

  /**
   * The closeDialog function emits a close event.
   */
  closeDialog():void {
    this.close.emit();
  }

}
