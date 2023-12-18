import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

export interface StorageChange {
  key: string;
  value: string;
  storageArea: "localStorage" | "sessionStorage";
}

export interface StorageGetItem {
  key: string;
  storageArea: "localStorage" | "sessionStorage";
}

@Injectable({ providedIn: "root" })
export class StorageService {
  public storageChange$: ReplaySubject<StorageChange> = new ReplaySubject();

  constructor() {}

  /**
   * The function sets an item in the specified storage area and emits a change event.
   * @param {StorageChange} change - The parameter "change" is of type "StorageChange".
   */
  public setStorageItem(change: StorageChange): void {
    window[change.storageArea].setItem(change.key, change.value);
    this.storageChange$.next(change);
  }

  /**
   * The function retrieves an item from a specified storage area using a given key.
   * @param {StorageGetItem} getItem - The getItem parameter is an object that contains two properties:
   */
  public getStorageItem(getItem: StorageGetItem): void {
    window[getItem.storageArea].getItem(getItem.key);
  }
}
