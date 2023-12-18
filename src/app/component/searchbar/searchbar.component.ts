import {Component, EventEmitter, Output} from '@angular/core';
import {DataExchangeSearchService} from "../../Services/dataExchangeSearch/data-exchange-search.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {

  public inputData: string;
  public searchTerm: string;
  @Output() search:EventEmitter<string>;

  /**
   * The constructor initializes the dataExchangeSearch service, creates an EventEmitter for search events, and initializes
   * inputData and searchTerm variables.
   * @param {DataExchangeSearchService} dataExchangeSearch - The `dataExchangeSearch` parameter is of type
   * `DataExchangeSearchService`. It is a private property that is being injected into the constructor.
   */
  constructor(private dataExchangeSearch: DataExchangeSearchService) {
    this.search = new EventEmitter<string>();
    this.inputData = '';
    this.searchTerm = '';
  }

  /**
   * The submitSearch function sets the form data in the dataExchangeSearch object.
   * @param {any} formData - The formData parameter is of type "any", which means it can accept any data type. It is used
   * to pass the form data to the submitSearch function.
   */
  public submitSearch(formData: any):void{
    this.dataExchangeSearch.setFormData(formData);
  }

  /**
   * The function "openSearchFeed" emits a search event.
   */
  public openSearchFeed():void{
    this.search.emit();
  }
}
