import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataExchangeSearchService {
  /* The line `private formData:BehaviorSubject<any> = new BehaviorSubject<any>(null);` is declaring a private variable
  `formData` of type `BehaviorSubject<any>`. */
  private formData:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * The function sets the value of the formData variable to the provided data.
   * @param {any} data - The "data" parameter in the "setFormData" method is of type "any", which means it can accept any
   * type of value.
   */
  public setFormData(data: any):void {
    this.formData.next(data);
  }

  /**
   * The function returns an Observable that emits the current value of a formData variable.
   * @returns The method is returning an Observable of type 'any'.
   */
  public getFormData():Observable<any> {
    return this.formData.asObservable();
  }
}
