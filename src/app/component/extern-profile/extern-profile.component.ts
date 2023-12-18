import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../Services/user/user.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';
import { FriendlistComponent } from '../friendlist/friendlist.component';
import { ProfileUser } from "../../Model/User";
import { filter, pluck } from "rxjs/operators";
import { StorageService } from "../../Services/storage/storage.service";
import {FeedComponent} from "../feed/feed.component";

@Component({
  selector: 'app-extern-profile',
  templateUrl: './extern-profile.component.html',
  styleUrls: ['./extern-profile.component.css']
})
export class ExternProfileComponent implements OnInit {

  @ViewChild(FriendlistComponent) friendListComponent!: FriendlistComponent;
  private uidToOpen$: Observable<string>;
  private externUserSubscription: Subscription;
  private uidToOpenSubscription: Subscription;
  public externUser$: Observable<ProfileUser | null>;

  profileForm = this.fb.group({
    uid: [''],
    userName: [''],
    fullName: [''],
    bio: [''],
  });

  /**
   * The constructor initializes various dependencies and creates observable variables.
   * @param {UsersService} userService - The userService parameter is an instance of the UsersService class, which is
   * responsible for handling user-related operations such as fetching user data, updating user information, etc.
   * @param {NonNullableFormBuilder} fb - The `fb` parameter is an instance of the `NonNullableFormBuilder` class. It is
   * used for creating and managing forms in Angular applications.
   * @param {StorageService} storageService - The `storageService` parameter is an instance of the `StorageService` class.
   * It is used to interact with storage systems, such as local storage or cloud storage, to store and retrieve data.
   * @param {FeedComponent} feedComponent - FeedComponent is a component that is responsible for displaying a feed of posts
   * or content. It is being injected into the constructor of the current class.
   */
  constructor(
    private userService: UsersService,
    private fb: NonNullableFormBuilder,
    private storageService: StorageService,
    private feedComponent: FeedComponent
  )
  {
    this.uidToOpen$ = new Observable<string>();
    this.externUser$ = new Observable<ProfileUser | null>();
    this.externUserSubscription = new Subscription();
    this.uidToOpenSubscription = new Subscription();

  }

  /**
   * The ngOnInit function subscribes to changes in the sessionStorage for the key "externUID", retrieves the value, and
   * uses it to fetch a user profile and load posts for that user.
   */
  ngOnInit(): void {

    this.uidToOpen$ = this.storageService.storageChange$.pipe(
      filter(({ storageArea }):boolean => storageArea === "sessionStorage"),
      filter(({ key }):boolean => key === "externUID"),
      pluck("value")
    );

    this.uidToOpenSubscription = this.uidToOpen$.subscribe((uid:string):void => {
      this.externUser$ = this.userService.getUserByID(uid);
      this.externUserSubscription = this.externUser$.subscribe((user:ProfileUser|null):void => {
        if (user) {
          this.profileForm.reset();
          this.profileForm.patchValue(user);
          this.feedComponent.loadPosts([user.uid]);
        }
      });
    });
  }

  /**
   * The ngOnDestroy function is used to unsubscribe from subscriptions in order to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.externUserSubscription.unsubscribe();
    this.uidToOpenSubscription.unsubscribe();
  }
}
