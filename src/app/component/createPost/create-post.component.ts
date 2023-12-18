import { Component } from '@angular/core';
import { DbServiceService } from 'src/app/Services/database/db-service.service';
import {MatDialog} from "@angular/material/dialog";
import { Post} from "../../Model/Post";
import { v4 as uuid } from 'uuid';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {UsersService} from "../../Services/user/user.service";
import {Subscription} from "rxjs";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [DbServiceService]
})
export class CreatePostComponent{

  private subscribition: Subscription;

  // @ts-ignore
  public selectedImageFile: File;
  public contentText: string;

  /**
   * The constructor initializes various services and variables used in the class.
   * @param {DbServiceService} firebaseStorageService - This parameter is of type `DbServiceService` and is used to
   * interact with the Firebase storage service. It is likely used to upload or retrieve files from the Firebase storage.
   * @param {MatDialog} dialog - The `dialog` parameter is an instance of the `MatDialog` class, which is a service
   * provided by Angular Material. It is used to open dialog windows, such as modal dialogs or pop-up dialogs, in your
   * application.
   * @param {DashboardComponent} dashboard - The `dashboard` parameter is of type `DashboardComponent`. It is used to
   * access the methods and properties of the `DashboardComponent` class within the constructor.
   * @param {UsersService} userService - The `userService` parameter is an instance of the `UsersService` class. It is used
   * to interact with user-related data and perform operations such as fetching user information, updating user details,
   * etc.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used to
   * display toast notifications in the application. Toast notifications are small pop-up messages that provide feedback or
   * information to the user.
   */
  constructor(private firebaseStorageService: DbServiceService, private dialog:MatDialog,
              private dashboard: DashboardComponent,
              private userService: UsersService, private toast: HotToastService) {
    this.contentText = "";
    this.subscribition = new Subscription();
  }

  /**
   * The function `onPhotoSelected` takes in a photo selector input element, reads the selected image file, and sets the
   * source of a preview image element to the base64 encoded string of the image.
   * @param {HTMLInputElement} photoSelector - The photoSelector parameter is of type HTMLInputElement. It represents the
   * input element that allows the user to select a photo file.
   */
  public onPhotoSelected(photoSelector: HTMLInputElement) : void{
    // @ts-ignore
    this.selectedImageFile = photoSelector.files[0];

    if (this.selectedImageFile != null){
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener("loadend", ev => {
        if (fileReader.result != null){
          let readableString : string = fileReader.result.toString();
          let postPreviewImage : HTMLImageElement = <HTMLImageElement>document.getElementById("post-preview-image");
          postPreviewImage.src = readableString;
        }
      });
    }
  }

  /**
   * The function `onUploadButtonPressed` creates a new post object with user information and content, uploads the post to
   * Firebase storage along with an optional image file, and displays a toast message indicating the upload status.
   */
  public onUploadButtonPressed(): void {
    this.subscribition = this.userService.currentUserProfile$.subscribe((user) => {
      const userID = user?.uid;
      const username = user?.userName;

      let post: Post = {
        postID: uuid(),
        username: username,
        userID: userID || "",
        contentText: this.contentText,
        contentImage: "",
        postDate: Date.now(),
        likes: [],
        comments: [],
      };
      this.firebaseStorageService.createPost(post, this.selectedImageFile).pipe(
         this.toast.observe({
          loading: 'Uploading...',
          success: 'Post uploaded successfully',
          error: 'Could not upload post',
        }
        )).subscribe(() => {
          this.dashboard.openBody('Dashboard');
        });
      this.subscribition.unsubscribe();
    });
  }



}
