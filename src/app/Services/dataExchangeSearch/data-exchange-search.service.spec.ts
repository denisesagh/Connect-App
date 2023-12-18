import { TestBed } from '@angular/core/testing';

import { DataExchangeSearchService } from './data-exchange-search.service';

describe('DataExchangeSearchService', () => {
  let service: DataExchangeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExchangeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the value of the formData variable to the provided data', () => {
    service.setFormData('test');
    let data = service.getFormData();
    expect(data.subscribe((value) => {
      expect(value).toEqual('test');
    }));
  })
});
