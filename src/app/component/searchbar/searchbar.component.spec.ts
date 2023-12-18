import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchbarComponent } from './searchbar.component';
import { DataExchangeSearchService } from '../../Services/dataExchangeSearch/data-exchange-search.service';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchbarComponent],
      imports: [FormsModule],
      providers: [DataExchangeSearchService],
    });
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test_submit_search_with_valid_form_data', () => {
    const dataExchangeSearchService = jasmine.createSpyObj('DataExchangeSearchService', ['setFormData']);
    const searchbarComponent = new SearchbarComponent(dataExchangeSearchService);
    const formData = {searchTerm: 'test', inputData: 'test input'};
    searchbarComponent.submitSearch(formData);
    expect(dataExchangeSearchService.setFormData).toHaveBeenCalledWith(formData);
  });

  it('test_open_search_feed_emits_search_event', () => {
    const searchbarComponent = new SearchbarComponent(new DataExchangeSearchService());
    spyOn(searchbarComponent.search, 'emit');
    searchbarComponent.openSearchFeed();
    expect(searchbarComponent.search.emit).toHaveBeenCalled();
  });


  it('test_submit_search_with_long_search_term', () => {
    const dataExchangeSearchService = jasmine.createSpyObj('DataExchangeSearchService', ['setFormData']);
    const searchbarComponent = new SearchbarComponent(dataExchangeSearchService);
    const formData = {searchTerm: 'a'.repeat(51), inputData: 'test input'};
    searchbarComponent.submitSearch(formData);
    expect(dataExchangeSearchService.setFormData).toHaveBeenCalledWith(formData);
  });

});
