import {Component} from '@angular/core';
import {distinctUntilChanged,Subscription} from "rxjs";
import {UsersService} from "../../Services/user/user.service";
import {ProfileUser} from "../../Model/User";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {ExternProfileComponent} from "../extern-profile/extern-profile.component";
import {StorageService} from "../../Services/storage/storage.service";

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.css']
})

export class FriendlistComponent {

  public friendsSubscription: Subscription;
  public profiles: ProfileUser[];
  public friends: string[];

  private userSubscription: Subscription;


  /**
   * The constructor initializes the class with necessary dependencies and sets initial values for friends and profiles.
   * @param {UsersService} usersService - An instance of the UsersService class, which is responsible for managing user
   * data and performing operations related to users.
   * @param {DashboardComponent} dashboardComponent - The `dashboardComponent` parameter is an instance of the
   * `DashboardComponent` class. It is likely used to interact with the dashboard component and access its properties and
   * methods.
   * @param {ExternProfileComponent} externProfile - The `externProfile` parameter is an instance of the
   * `ExternProfileComponent` class. It is likely used to access and manipulate external user profiles in the application.
   * @param {StorageService} storageService - The `storageService` parameter is an instance of the `StorageService` class.
   * It is used to interact with the browser's local storage and perform operations like storing and retrieving data.
   */
  constructor(public usersService: UsersService, public dashboardComponent: DashboardComponent,
              public externProfile: ExternProfileComponent, public storageService: StorageService) {
    this.friendsSubscription = new Subscription();
    this.userSubscription = new Subscription();
    this.friends = [];
    this.profiles = [];

  }

  /**
   * The ngOnInit function retrieves the current user's profile and their list of friends, sorts the friends alphabetically
   * by their full name, and stores them in the profiles array.
   */
  ngOnInit():void{
    this.friendsSubscription = this.usersService.currentUserProfile$
      .pipe(distinctUntilChanged())
      .subscribe((profile: ProfileUser|null):void=>{

        this.profiles = [];
        if (profile && profile.iAmFollowing){

          this.friends = profile?.iAmFollowing;
          this.friends.forEach((friendID:string):void =>{
            this.userSubscription = this.usersService.getUserByID(friendID).subscribe((user:ProfileUser|null):void =>{

              if (user){
                if (!user.fullName) {
                  user.fullName= user.userName;
                }

                if (user && !this.profiles.find(p => p.uid === user.uid)) {  // Prüfung, ob bereits vorhanden
                  this.profiles.push(user);

                  //Soriteren der Freundesliste (alphabetisch)
                  this.profiles.sort((a:ProfileUser, b:ProfileUser):number => {
                    if (a.fullName && b.fullName) {
                      return a.fullName.localeCompare(b.fullName);
                    } else {
                      return 0;
                    }
                  });

                }
              }
              console.log("Friends: " + this.profiles.length);
            })
          });
        }else{
          console.log("No Friends")
        }
      })
  }



  /**
   * The function `profilAufrufen` sets a message, destroys and initializes a component, and opens the body of the
   * dashboard component with the title "Externes Profil".
   * @param {string} userID - The userID parameter is a string that represents the unique identifier of a user.
   */
  public profilAufrufen(userID:string):void{
    this.setMessage(userID);
    this.externProfile.ngOnDestroy();
    this.externProfile.ngOnInit();

    this.dashboardComponent.openBody('Externes Profil');
}


  /**
   * The function sets a value in the sessionStorage with the key "externUID".
   * @param {string} value - The value parameter is a string that represents the value you want to set in the storage item.
   */
  setMessage(value: string): void {
    this.storageService.setStorageItem({
      key: "externUID",
      value,
      storageArea: "sessionStorage"
    });
  }


  /**
   * The removeFriend function logs the userID and then calls the removeFriend method from the usersService, logging
   * "Removed Friend!" when the promise is resolved.
   * @param {string} userID - The userID parameter is a string that represents the unique identifier of the user to be
   * removed as a friend.
   */
  public removeFriend(userID: string):void{
    console.log("Remove: "+userID)
    this.usersService.removeFriend(userID).then((r:void) => console.log("Removed Friend!"));
  }

  /**
   * The ngOnDestroy function is used to unsubscribe from subscriptions to avoid memory leaks.
   */
  ngOnDestroy():void{
    this.friendsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
