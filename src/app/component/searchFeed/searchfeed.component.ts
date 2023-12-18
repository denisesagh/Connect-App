import {Component, OnInit} from '@angular/core';
import {ProfileUser} from "../../Model/User";
import {UsersService} from "../../Services/user/user.service";
import {DataExchangeSearchService} from "../../Services/dataExchangeSearch/data-exchange-search.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-searchfeed',
  templateUrl: './searchfeed.component.html',
  styleUrls: ['./searchfeed.component.css']
})
export class SearchfeedComponent implements OnInit {

  public searchedUsers: ProfileUser[];

  public formDataSubscribtion: Subscription;
  public formData: string;
  private searchTerm: string;

  /**
   * The constructor initializes the private userService, dataExchangeSearch, formDataSubscribtion, searchedUsers,
   * searchTerm, and formData properties.
   * @param {UsersService} userService - The userService parameter is an instance of the UsersService class, which is
   * responsible for handling user-related operations such as fetching user data, creating new users, updating user
   * information, etc.
   * @param {DataExchangeSearchService} dataExchangeSearch - The `dataExchangeSearch` parameter is an instance of the
   * `DataExchangeSearchService` class. It is used to perform search operations related to data exchange.
   */
  constructor(private userService: UsersService,
              private dataExchangeSearch: DataExchangeSearchService) {
    this.formDataSubscribtion = new Subscription();
    this.searchedUsers = [];
    this.searchTerm = "";
    this.formData = "";
  }
  /**
   * The ngOnInit function subscribes to a data exchange service, retrieves form data, and uses it to search for users,
   * logging the form data and search results.
   */
  ngOnInit():void {
    this.formDataSubscribtion = this.dataExchangeSearch.getFormData().subscribe(async data => {
      this.formData = data.inputData;
      console.log(this.formData);
      this.searchedUsers = await this.userService.getUsers(this.formData);
      console.log("Search results: " + this.searchedUsers);
    });
  }

  /**
   * The function "addFollow" asynchronously adds a friend to the user's list of friends using the "addFriend" method from
   * the "userService" object.
   * @param {string} friend - The "friend" parameter is a string that represents the username or ID of the friend that you
   * want to add.
   */
  public async addFollow(friend:string): Promise<void>{
    await this.userService.addFriend(friend);
  }

  public profilAufrufen(userID: string):void{

  }

  /**
   * The ngOnDestroy function unsubscribes from a subscription to prevent memory leaks.
   */
  ngOnDestroy():void{
    this.formDataSubscribtion.unsubscribe();
  }
}
