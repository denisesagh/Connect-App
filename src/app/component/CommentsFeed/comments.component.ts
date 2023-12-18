import {Component} from '@angular/core';
import {Post} from "../../Model/Post";
import {DbServiceService} from "../../Services/database/db-service.service";
import {map, Observable, Subscription} from "rxjs";
import {CommentI} from "../../Model/Comment";
import {UsersService} from "../../Services/user/user.service";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  private readonly postID: string;
  private userID: string;
  private checkIfLikedSubscription: Subscription;
  private countLikesSubscription: Subscription;

  public post$ : Observable<Post>;
  public comments: Observable<CommentI[]>;
  public isWriteCommentActive:boolean;
  public newPostHaveILiked: boolean;

  /**
   * This constructor initializes various properties and subscriptions, and retrieves the current user's profile and post
   * details if available.
   * @param {DbServiceService} firebaseStorageService - The `firebaseStorageService` parameter is an instance of the
   * `DbServiceService` class, which is responsible for interacting with the Firebase storage service. It provides methods
   * for retrieving posts and comments from the database.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to retrieve the current user's profile information.
   */
  constructor(private firebaseStorageService: DbServiceService, private userService: UsersService) {

    this.post$ = new Observable<Post>();
    this.comments = new Observable<CommentI[]>();
    this.checkIfLikedSubscription = new Subscription();
    this.countLikesSubscription = new Subscription();

    this.userID = sessionStorage.getItem("userID") || "";
    this.postID = ""
    this.isWriteCommentActive = false;
    this.newPostHaveILiked = false;

    const localStoragePostID: string|null = localStorage.getItem('postID');
    localStorage.removeItem('postID');

    this.userService.currentUserProfile$.subscribe((user) => {
      if(user){
        this.userID = user.uid;
      }
    });

    if (localStoragePostID != null){
      this.postID = localStoragePostID;
      this.post$ = firebaseStorageService.getPostByID(this.postID).pipe(map((newPosts:Post) => this.mapPost(newPosts)));
      this.comments = this.firebaseStorageService.getCommentsForPost(this.postID);
    }
  }

  /**
   * The function `mapPost` takes a `newPost` object and returns a modified version of it with additional properties and
   * updated values.
   * @param {Post} newPost - The `newPost` parameter is an object of type `Post` which contains the following properties:
   * @returns a new object with properties from the `newPost` object, along with additional properties `formattedPostDate`,
   * `newPostHaveILiked`, and `likeCount`.
   */
  private mapPost(newPost: Post): Post{
    this.checkIfLikedSubscription = this.firebaseStorageService.checkIfUserAlreadyLiked(newPost.postID, sessionStorage.getItem("uid")||"").subscribe(result =>{
      newPost.haveILiked = result;
    });

    this.countLikesSubscription = this.firebaseStorageService.countLikes(newPost.postID).subscribe(result => {
      newPost.likeCount = result;
    });
    if (newPost.haveILiked != undefined){
      this.newPostHaveILiked = newPost.haveILiked;
    }

    return {
      postID: newPost.postID,
      userID: newPost.userID,
      postDate: newPost.postDate,
      formattedPostDate: new Date(newPost.postDate)
        .toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
      username: newPost.username,
      contentText: newPost.contentText,
      contentImage: newPost.contentImage,
      likes: newPost.likes,
      comments: newPost.comments,
      haveILiked: newPost.haveILiked,
      likeCount: newPost.likeCount
    };
  }

  /**
   * The function showDialog sets the postID in the localStorage and activates the isWriteCommentActive flag.
   */
  showDialog(): void{
    localStorage.setItem('postID', this.postID);
    this.isWriteCommentActive = true;
  }

  /**
   * The closeDialog function sets the isWriteCommentActive variable to false.
   */
  closeDialog():void {
    this.isWriteCommentActive = false;

  }

  /**
   * The ngOnDestroy function unsubscribes from two subscriptions.
   */
  ngOnDestroy(): void {
    this.checkIfLikedSubscription.unsubscribe();
    this.countLikesSubscription.unsubscribe();
  }

}


