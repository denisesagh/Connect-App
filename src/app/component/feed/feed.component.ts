import {Component, Input} from '@angular/core';
import {Post} from "../../Model/Post";
import {DbServiceService} from "../../Services/database/db-service.service";
import { map, Observable, Subscription, take, tap} from "rxjs";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {UsersService} from "../../Services/user/user.service";
import {filter, pluck} from "rxjs/operators";
import {StorageService} from "../../Services/storage/storage.service";
import {ProfileUser} from "../../Model/User";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {

  public posts$: Observable<Post[]>;

  currentUser$: Observable<ProfileUser>;
  private uidToOpen$: Observable<string>;
  private currentUserSubscription: Subscription;
  private checkIfUserAlreadyLikedSubscription: Subscription;
  private countLikesSubscription: Subscription;
  private uidToOpenSubscription: Subscription;

  private uid: string;
  @Input() loadMode: string;

  /**
   * This constructor initializes various properties and subscriptions in the class.
   * @param {DbServiceService} firebaseStorageService - An instance of the DbServiceService class, which is responsible for
   * interacting with the Firebase storage service.
   * @param {DashboardComponent} dashboardComponent - The `dashboardComponent` parameter is an instance of the
   * `DashboardComponent` class. It is used to access the methods and properties of the `DashboardComponent` within the
   * constructor.
   * @param {UsersService} usersService - The `usersService` parameter is a service that provides functionality related to
   * user profiles, such as retrieving the current user's profile information.
   * @param {StorageService} storageService - The `storageService` parameter is an instance of the `StorageService` class.
   * It is used to interact with the storage system, such as uploading and downloading files.
   */
  constructor(private firebaseStorageService: DbServiceService, private dashboardComponent: DashboardComponent,
              private usersService: UsersService, private storageService: StorageService) {
    this.posts$ = new Observable<Post[]>();
    this.uidToOpen$ = new Observable<string>();

    this.currentUserSubscription = new Subscription();
    this.checkIfUserAlreadyLikedSubscription = new Subscription();
    this.countLikesSubscription = new Subscription();
    this.uidToOpenSubscription = new Subscription();

    this.uid = "default";
    this.loadMode = "Feed";

    this.currentUser$ = this.usersService.currentUserProfile$.pipe(
      filter(user => user != null)
    )  as Observable<ProfileUser>;


    this.currentUserSubscription = this.currentUser$.pipe(
      take(1),
      tap(user => this.uid = user.uid)
    ).subscribe();

  }

  /**
   * The ngOnInit function is used to load the manager based on the specified load mode.
   */
  ngOnInit(): void {
    this.loadManager(this.loadMode);
  }

  /**
   * The function "loadManager" takes a loadMode parameter and calls different functions based on the value of loadMode.
   * @param {string} loadMode - The `loadMode` parameter is a string that determines which method to call. The available
   * options are:
   * @returns In this code, the function is not returning any value. It is using the `return` statement to exit the
   * function early and return control to the calling code.
   */
  private loadManager(loadMode:string):void{
    if(loadMode == "Feed") {
      this.loadFeed();
      return
    }if(loadMode == "Profile"){
      this.loadProfile();
      return
    }if (loadMode == "AllPosts"){
      this.loadAllPosts();
      return
    }if(loadMode == "ExternProfile"){
      this.loadExternalProfile();
      return
    }
    else{
      console.log("Invalid loadMode!")
    }
  }

  /**
   * The function `loadFeed` loads the current user's profile, updates the list of users they are following, and then loads
   * the posts from those users.
   */
  private loadFeed():void{
    this.currentUserSubscription = this.usersService.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user) => {
        this.uid = user.uid;
        console.log("Following"+ user.iAmFollowing)
        if(user.iAmFollowing != null){
          user.iAmFollowing.push(this.uid);
        } else {
          user.iAmFollowing = [this.uid];
        }
        this.loadPosts(user.iAmFollowing);
      });
  }

  /**
   * The function "loadProfile" loads the current user's profile and then calls the "loadPosts" function with the user's ID
   * as a parameter.
   */
  private loadProfile():void{
    this.currentUserSubscription = this.usersService.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user) => {
        this.uid = user.uid;
        this.loadPosts([this.uid]);
      });
  }

  /**
   * The function "loadExternalProfile" loads posts based on the external user ID stored in the session storage.
   */
  private loadExternalProfile():void{
    this.uidToOpen$ = this.storageService.storageChange$.pipe(
      filter(({ storageArea }) => storageArea === "sessionStorage"),
      filter(({ key }) => key === "externUID"),
      pluck("value")
    );
    this.uidToOpenSubscription = this.uidToOpen$.subscribe(uid =>{this.loadPosts([uid])});
  }

  /**
   * The function `loadAllPosts` loads all posts from a Firebase database and returns an observable of type `Post[]`.
   * @returns an Observable of type Post[].
   */
  private loadAllPosts():Observable<Post[]>{
    this.posts$ = this.firebaseStorageService.getAllPostsFromDB().pipe(
      map((newPost:Post[]) =>this.getPostReadyForReturn(newPost))
    );
    console.log(this.posts$);
    return this.posts$;
  }

  /**
   * The function `loadPosts` loads posts from a Firebase database based on a list of user IDs and returns an observable
   * stream of the posts.
   * @param {string[]} uids - The parameter "uids" is an array of strings representing user IDs.
   * @returns an Observable of type any.
   */
  public loadPosts(uids: string[]):Observable<any> {
    this.posts$ = this.firebaseStorageService.getAllPostsFromDBByUID(uids).pipe(
      map((newPosts:Post[]) => this.getPostReadyForReturn(newPosts)) // Verarbeite die neuen Posts
    );
    console.log(this.posts$)
    return this.posts$;
  }

  /**
   * The function takes an array of new posts, prepares and maps them, and then returns the modified array.
   * @param {Post[]} newPosts - An array of Post objects.
   * @returns an array of Post objects.
   */
  private getPostReadyForReturn(newPosts: Post[]): Post[]{
    newPosts = this.preparePosts(newPosts);
    newPosts = this.mapPosts(newPosts);
    return newPosts;
  }

  /**
   * The function prepares new posts by subscribing to the countLikes and checkIfUserAlreadyLiked methods and updating the
   * likeCount and haveILiked properties of each post.
   * @param {Post[]} newPosts - An array of Post objects.
   * @returns an array of Post objects.
   */
  private preparePosts(newPosts: Post[]): Post[]{
    newPosts.forEach((post:Post):void =>{
      this.countLikesSubscription = this.firebaseStorageService.countLikes(post.postID)
        .subscribe((likeCount:number):void =>{
          post.likeCount = likeCount;
        })

      this.checkIfUserAlreadyLikedSubscription = this.firebaseStorageService
        .checkIfUserAlreadyLiked(post.postID, sessionStorage.getItem("uid") || "")
        .subscribe((result:boolean):void =>{
          post.haveILiked = result;
        })
    })

    if (newPosts.length == 0 && this.loadMode=="Feed") this.loadManager("AllPosts");

    return newPosts;
  }

  /**
   * The function `mapPosts` takes an array of `Post` objects and returns a new array of `Post` objects with some
   * additional properties.
   * @param {Post[]} newPosts - An array of Post objects.
   * @returns an array of mapped posts. Each post in the array has the same properties as the original post, but with an
   * additional property called "formattedPostDate" which is a formatted version of the "postDate" property.
   */
  private mapPosts(newPosts: Post[]): Post[] {

    return newPosts.map((post:Post):Post => ({
      postID: post.postID,
      userID: post.userID,
      postDate: post.postDate,
      formattedPostDate: new Date(post.postDate)
        .toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
      username: post.username,
      contentText: post.contentText,
      contentImage: post.contentImage,
      likes: post.likes,
      comments: post.comments,
      haveILiked: post.haveILiked,
      likeCount: post.likeCount,
    }));
  }

  /**
   * The function "changeToCommentComponent" sets the postID and postUserID in the localStorage and opens the
   * "CommentsFeed" component in the dashboard.
   * @param {string} postID - The postID parameter is a string that represents the ID of a post.
   * @param {string} postUserID - The postUserID parameter is the ID of the user who made the post.
   */
  public changeToCommentComponent(postID: string, postUserID: string):void{
    localStorage.setItem('postID', postID);
    localStorage.setItem("postUserID", postUserID)
    this.dashboardComponent.openBody("CommentsFeed");
  }

  /**
   * The ngOnDestroy function is used to clean up resources and subscriptions before the component is destroyed.
   */
  ngOnDestroy(): void {
    console.log("Feed destroyed");
    this.currentUserSubscription.unsubscribe();
    this.checkIfUserAlreadyLikedSubscription.unsubscribe();
    this.countLikesSubscription.unsubscribe();
    this.uidToOpenSubscription.unsubscribe();
  }

}
