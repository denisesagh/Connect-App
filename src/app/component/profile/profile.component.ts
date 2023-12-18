import { Component, OnInit } from '@angular/core';
import {FormGroup, NonNullableFormBuilder} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {Observable, Subscription, switchMap} from 'rxjs';
import { ProfileUser } from 'src/app/Model/User';
import { ImageUploadService } from 'src/app/Services/image/image-upload.service';
import { UsersService } from 'src/app/Services/user/user.service';
import {FeedComponent} from "../feed/feed.component";

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  public user$:Observable<ProfileUser | null>;
  private currentUserSubscription: Subscription;
  private uploadImageSubscription: Subscription;
  private userServiceSubscription: Subscription;

  /* The `profileForm` variable is an instance of the `FormGroup` class, which is used to create and manage forms in
  Angular applications. In this case, the `profileForm` is being initialized with a form group that has four form
  controls: `uid`, `userName`, `fullName`, and `bio`. Each form control is initialized with an empty string as its
  initial value. */
  profileForm:FormGroup = this.fb.group({
    uid: [''],
    userName: [''],
    fullName: [''],
    bio: [''],
  });

  /**
   * The constructor initializes various services and subscriptions used in the class.
   * @param {ImageUploadService} imageUploadService - An instance of the ImageUploadService class, which is responsible for
   * uploading images.
   * @param {HotToastService} toast - The `toast` parameter is an instance of the `HotToastService` class, which is used
   * for displaying toast notifications in the user interface.
   * @param {UsersService} usersService - An instance of the UsersService class, which is responsible for managing user
   * profiles and related operations.
   * @param {NonNullableFormBuilder} fb - The `fb` parameter is an instance of the `NonNullableFormBuilder` class. It is
   * used for creating and managing forms in Angular applications.
   */
  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder)
  {
    this.user$ = this.usersService.currentUserProfile$;
    this.currentUserSubscription = new Subscription();
    this.uploadImageSubscription = new Subscription();
    this.userServiceSubscription = new Subscription();
  }

  /**
   * The ngOnInit function subscribes to the currentUserProfile$ observable and updates the profileForm with the user's
   * data if a user is present.
   */
  ngOnInit(): void {

    this.currentUserSubscription = this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user:ProfileUser |null):void => {
        if (user){
          this.profileForm.patchValue({ ...user });
        }
      });

  }

  /**
   * The function `uploadFile` uploads an image file, displays a toast message based on the upload status, and updates the
   * user's profile with the uploaded image URL.
   * @param {any} event - The event parameter is an object that represents the event that triggered the file upload. It
   * typically contains information about the uploaded file, such as its name, size, and type.
   * @param {ProfileUser}  - - `event: any`: This parameter represents the event object that is triggered when a file is
   * selected for upload. It is of type `any`, meaning it can be any type of event object.
   */
  uploadFile(event: any, { uid }: ProfileUser):void {
    this.uploadImageSubscription = this.imageUploadService
      .uploadImage(event.target.files[0], `/profileImages/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((photoURL:string) =>
          this.usersService.updateUser({
            uid,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  /**
   * The `saveProfile` function updates a user's profile data and displays a toast message indicating the success or
   * failure of the update.
   * @returns void, which means it does not return any value.
   */
  saveProfile():void {

    const { uid, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }

    this.userServiceSubscription = this.usersService
      .updateUser({ uid, ...data })
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();
  }

  /**
   * The ngOnDestroy function is used to unsubscribe from various subscriptions in order to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.uploadImageSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }

}
