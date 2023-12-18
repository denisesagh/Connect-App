import { Injectable } from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {EMPTY, from, map, Observable, of, Subscriber, switchMap} from 'rxjs';
import {Post} from "../../Model/Post";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import { getDatabase, ref, onValue} from "firebase/database";
import {Database, push, remove} from "@angular/fire/database";
import {CommentI} from "../../Model/Comment";
import firebase from "firebase/compat";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;


@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  /**
   * This is a constructor function that takes in AngularFireStorage and AngularFireDatabase as parameters.
   * @param {AngularFireStorage} storage - The storage parameter is an instance of the AngularFireStorage service, which is
   * used for interacting with Firebase Storage. It provides methods for uploading, downloading, and managing files in the
   * storage bucket.
   * @param {AngularFireDatabase} db - The "db" parameter is an instance of the AngularFireDatabase service, which is used
   * to interact with the Firebase Realtime Database. It provides methods for reading, writing, and querying data in the
   * database.
   */
  constructor(private storage: AngularFireStorage, private db:AngularFireDatabase ) {

  }

  /**
   * The function `uploadImage` takes a file and uploads it to a specified path in Firebase Storage, returning an
   * observable that emits the download URL of the uploaded image.
   * @param {string} path - The `path` parameter is a string that represents the location where the image file will be
   * stored in the Firebase Storage. It can be a path to a specific folder or a combination of folders and file name. For
   * example, "images/profile.jpg" or "photos/2021/summer/beach
   * @param {File} file - The "file" parameter is of type "File" and represents the file that you want to upload to the
   * storage.
   * @returns an Observable of type string.
   */
  private uploadImage(path: string, file: File): Observable<string> {
    const ref:AngularFireStorageReference = this.storage.ref(path);
    const task : AngularFireUploadTask = ref.put(file);

    return from(task).pipe(
      switchMap((snapshot:UploadTaskSnapshot):Observable<any> => {
        const downloadURL:Observable<any> = ref.getDownloadURL();
        return snapshot.state === 'success'
          ? downloadURL
          : EMPTY;
      })
    );
  }

  /**
   * The savePost function saves a post object to a database and returns an observable of the saved post.
   * @param {Post} post - The `post` parameter is an object of type `Post`. It contains the following properties:
   * @returns an Observable of type Post.
   */
  public savePost(post: Post): Observable<Post> {
    return from(this.db.object('/post/'+post.postID).set({
      username: post.username,
      userID: post.userID,
      contentImage: post.contentImage,
      contentText: post.contentText,
      postDate: post.postDate,
      comments: post.comments,
      likes: post.likes
    })).pipe(
      map(() => post)
    );
  }

  /**
   * The function creates a post with an optional image and saves it, or uploads the image and then saves the post.
   * @param {Post} post - The `post` parameter is an object of type `Post` which contains the details of the post to be
   * created. It may have properties such as `contentText` (the text content of the post) and `contentImage` (the URL of
   * the image associated with the post).
   * @param {File} selectedImageFile - The `selectedImageFile` parameter is of type `File` and represents the image file
   * that the user has selected to be associated with the post.
   * @returns an Observable of type `any`.
   */
  public createPost(post: Post, selectedImageFile: File): Observable<any> {
    if (selectedImageFile == null && post.contentText == "") {
      return of(null);
    }

    if (selectedImageFile == null && post.contentText != null) {
      return this.savePost(post).pipe(map((savedPost:Post) => savedPost));
    }
    return this.uploadImage('/postImages/' + selectedImageFile.name, selectedImageFile)
      .pipe(
        switchMap((downloadURL:string):Observable<any> => {
          if (downloadURL != null) {
            post.contentImage = downloadURL;
            return this.savePost(post);
          }
          return of(null);
        })
      );
  }

  /**
   * The function retrieves a post from a database based on its ID and returns it as an Observable.
   * @param {string} postID - The `postID` parameter is a string that represents the unique identifier of a post in the
   * database.
   * @returns an Observable of type Post.
   */
  public getPostByID(postID: string): Observable<Post> {
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}`);

    return new Observable<Post>((observer:Subscriber<Post>):void => {
      onValue(reference, (snapshot):void => {
        const data: Post = snapshot.val();
        data.postID = postID;
        observer.next(data);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }


  /**
   * The function retrieves all posts from a database, sorts them by post date in descending order, and returns them as an
   * observable.
   * @returns an Observable of type Post[].
   */
  public getAllPostsFromDB(): Observable<Post[]> {
    const db: Database = getDatabase();
    const reference = ref(db, 'post');

    return new Observable<Post[]>((observer):void => {
      onValue(reference, (snapshot) => {
        const posts: Post[] = [];
        snapshot.forEach(childSnapshot => {
          const data: Post = childSnapshot.val();
          data.postID = <string>childSnapshot.key;
          posts.push(data);
        });
        posts.sort((a:Post, b:Post) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
        observer.next(posts);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }


  /**
   * The function retrieves all posts from a database based on a given array of user IDs and returns them in descending
   * order by post date.
   * @param {string[]} uid - The `uid` parameter is an array of strings representing user IDs.
   * @returns an Observable of type Post[].
   */
  public getAllPostsFromDBByUID(uid: string[]): Observable<Post[]> {
    const db: Database = getDatabase();
    const reference = ref(db, 'post');
    return new Observable<Post[]>((observer:Subscriber<Post[]>):void => {
      onValue(reference, (snapshot):void => {
        const posts: Post[] = [];
        snapshot.forEach((childSnapshot):void => {
          const data: Post = childSnapshot.val();
          data.postID = <string>childSnapshot.key;

          if(uid.includes(data.userID)){
            posts.push(data);
          }
        });
        posts.sort((a:Post, b:Post) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
        observer.next(posts);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }

  /**
   * The function retrieves comments for a specific post from a database and returns them in descending order based on
   * their post date.
   * @param {string} postID - The `postID` parameter is a string that represents the ID of a post. It is used to retrieve
   * the comments associated with that post from the database.
   * @returns an Observable of type CommentI[], which represents an array of comments for a specific post.
   */
  public getCommentsForPost(postID: string): Observable<CommentI[]> {
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/comments`);

    return new Observable<CommentI[]>((observer:Subscriber<CommentI[]>):void => {
      onValue(reference, (snapshot):void => {
        const comments: CommentI[] = [];
        snapshot.forEach((childSnapshot):void => {
          const data = childSnapshot.val();
          comments.push(data);
        });
        comments.sort((a:CommentI, b:CommentI) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
        observer.next(comments);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }

  /**
   * The function uploads a comment to a post in a database.
   * @param {string} postID - The postID parameter is a string that represents the ID of the post to which the comment will
   * be uploaded.
   * @param {CommentI} comment - The "comment" parameter is an object of type "CommentI". It represents the comment that
   * you want to upload to a post.
   * @returns a Promise<void>.
   */
  public uploadCommentToPost(postID: string, comment: CommentI): Promise<void> {
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/comments`);

    return push(reference, comment).then(():void => {
      console.log('Comment added successfully!');
    }).catch((error:Error):void => {
      console.error(error);
    });
  }


  /**
   * The function `countLikes` retrieves the number of likes for a given post ID from a database and returns it as an
   * observable.
   * @param {string} postID - The `postID` parameter is a string that represents the ID of a post.
   * @returns The countLikes function returns an Observable<number>.
   */
  public countLikes(postID: string): Observable<number> {
    let likes: number = 0;
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/likes`);

    return new Observable<number>((observer:Subscriber<number>):void => {
      onValue(reference, (snapshot):void => {
        snapshot.forEach((childSnapshot):void => {
          likes++;
        })
        observer.next(likes);
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }

  /**
   * The function adds a like to a post in a database.
   * @param {string} postID - The postID parameter is a string that represents the unique identifier of the post to which
   * the like is being added.
   * @param {string} userID - The `userID` parameter is a string that represents the unique identifier of the user who is
   * liking the post.
   * @returns a Promise<void>.
   */
  public addLikesToPost(postID: string, userID: string): Promise<void>{
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/likes/${userID}`);
    return push(reference, new Date().toDateString()).then(():void => {
      console.log('Like added successfully!');
    }).catch((error:Error):void => {
      console.error(error);
    });
  }

  /**
   * The function `removeLikeOfPost` removes a like from a post in a database using the provided post ID and user ID.
   * @param {string} postID - The postID parameter is a string that represents the unique identifier of the post from which
   * the like is being removed.
   * @param {string} userID - The userID parameter represents the unique identifier of the user who wants to remove their
   * like from a post.
   * @returns a Promise<void>.
   */
  public removeLikeOfPost(postID: string, userID: string): Promise<void>{
    console.log("PostID: "+ postID);
    console.log("UserID: "+ userID);
    console.log(`post/${postID}/likes/${userID}`)
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/likes/${userID}`);

    return remove(reference).then(():void => {
      console.log('Like removed successfully!');
    }).catch((error:Error):void => {
      console.error(error);
    });
  }



  /**
   * The function checks if a user has already liked a specific post.
   * @param {string} postID - The postID parameter is a string that represents the unique identifier of a post.
   * @param {string} userID - The `userID` parameter is a string that represents the unique identifier of a user. It is
   * used to check if the user has already liked a specific post.
   * @returns an Observable<boolean>.
   */
  public checkIfUserAlreadyLiked(postID: string, userID: string): Observable<boolean> {
    const db: Database = getDatabase();
    const reference = ref(db, `post/${postID}/likes/${userID}`);
    return new Observable<boolean>((observer:Subscriber<boolean>):void => {
      onValue(reference, (snapshot):void => {
        if (snapshot.exists()) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      }, (error:Error):void => {
        observer.error(error);
      });
    });
  }
}
