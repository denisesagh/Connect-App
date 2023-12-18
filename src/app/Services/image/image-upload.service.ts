import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytes,
} from 'firebase/storage';
import { from, Observable, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})



export class ImageUploadService {

  private storage = getStorage();

  constructor() {
  }

  /**
   * The function `uploadImage` takes an image file and a storage path, uploads the image to the specified path, and
   * returns an observable that emits the download URL of the uploaded image.
   * @param {File} image - The "image" parameter is of type "File" and represents the image file that you want to upload.
   * @param {string} path - The `path` parameter is a string that represents the location where you want to store the
   * uploaded image in your storage system. It could be a folder path or a specific file path.
   * @returns an Observable of type string.
   */
  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage , path);
    const uploadTask:Observable<any> = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }


}
