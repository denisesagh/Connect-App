import {Injectable, Query} from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc, getDocs, query,
  setDoc,
  updateDoc, where,
} from '@angular/fire/firestore';
import { from,  Observable, of, switchMap} from 'rxjs';
import { ProfileUser } from 'src/app/Model/User';
import { AuthService } from "src/app/shared/auth.service";

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  /**
   * The function `currentUserProfile$` returns an Observable that emits the current user's profile information or null if
   * there is no user logged in.
   * @returns The `currentUserProfile$` method returns an Observable that emits either a `ProfileUser` object or `null`.
   */
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        sessionStorage.setItem("uid", user.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  /**
   * The function `currentUserSettings$` returns an observable that emits the current user's settings if available, or null
   * if the user profile or settings are not present.
   * @returns The `currentUserSettings$` function returns an Observable that emits the current user's settings.
   */
  get currentUserSettings$(){
    return this.currentUserProfile$.pipe(
      switchMap((profile:ProfileUser|null):Observable<ProfileUser> | Observable<any> => {
        if (!profile || !profile.settings) {
          return of(null);
        }

        return of(profile.settings);
      })
    );
  }

  /**
   * The function `getUserByID` retrieves a user profile from Firestore based on the provided user ID, returning an
   * Observable that emits the profile user or null.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of a user.
   * @returns an Observable of type `ProfileUser | null`.
   */
  public getUserByID(userId: string): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap(():Observable<any> => {
        if (!userId) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', userId);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }


  /**
   * The function adds a user to a Firestore collection and stores the user's UID in the session storage.
   * @param {ProfileUser} user - The parameter `user` is of type `ProfileUser`.
   * @returns an Observable of type `void`.
   */
  public addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    sessionStorage.setItem("uid", user.uid);
    return from(setDoc(ref, user));
  }



  /**
   * The function updates a user profile in a Firestore database.
   * @param {ProfileUser} user - The `user` parameter is an object of type `ProfileUser`. It represents the user profile
   * that needs to be updated.
   * @returns an Observable of type void.
   */
  public updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  /**
   * The function `getUsers` retrieves a list of user profiles based on a given name, excluding the current user, and
   * checks if the current user is following each user in the list.
   * @param {String} name - The `name` parameter is a string that represents the name of the user you are searching for.
   * @returns an array of objects of type `ProfileUser`.
   */
  public async getUsers(name: String): Promise<ProfileUser[]> {
    const myUid:string = sessionStorage.getItem("uid") || '';
    const returnDoc: ProfileUser[] = [];

    const usersDB = collection(this.firestore, "users");
    const q = query(usersDB, where("userName", "!=", ""));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {

      const userName = doc.get("userName");
      const uid = doc.get("uid");

      if (userName.includes(name) && uid != myUid) {

        const thisUser: ProfileUser = {
          uid,
          userName,
          myFollower: doc.get("myFollower"),
          areWeFriends: await this.amIFollowing(uid, myUid, "myFollower")
        };

        returnDoc.push(thisUser);
      }
    }
    return returnDoc;
  }

  /**
   * The `addFriend` function adds a new friend to the current user's friend list and updates both the current user's and
   * the new friend's profiles in the database.
   * @param {string} newFriend - The `newFriend` parameter is a string that represents the UID (User ID) of the new friend
   * that you want to add.
   */
  public async addFriend(newFriend: string): Promise<void> {
    const myUid:string = sessionStorage.getItem("uid") || '';
    const usersDB = collection(this.firestore, "users");

    // Get the new friend's profile from the database
    const newFriendQuery = query(usersDB, where("uid", "==", newFriend));
    const newFriendSnapshot = await getDocs(newFriendQuery);
    const newFriendProfile:ProfileUser = newFriendSnapshot.docs[0]?.data() as ProfileUser;

    // Add the current user's UID to the new friend's myFollower array
    if (newFriendProfile?.myFollower) {
      newFriendProfile.myFollower = [...newFriendProfile.myFollower, myUid];
    } else {
      newFriendProfile.myFollower = [myUid];
    }
    this.updateUser(newFriendProfile);

    // Add the new friend's UID to the current user's iAmFollowing array
    const currentUserQuery = query(usersDB, where("uid", "==", myUid));
    const currentUserSnapshot = await getDocs(currentUserQuery);
    const currentUserProfile:ProfileUser = currentUserSnapshot.docs[0]?.data() as ProfileUser;
    if (currentUserProfile?.iAmFollowing) {
      currentUserProfile.iAmFollowing = [...currentUserProfile.iAmFollowing, newFriend];
    } else {
      currentUserProfile.iAmFollowing = [newFriend];
    }
    this.updateUser(currentUserProfile);
  }


  /**
   * The `removeFriend` function removes a friend from the current user's friend list by updating both the current user's
   * and the friend's user profiles.
   * @param {string} friendUID - The `friendUID` parameter is a string that represents the unique identifier of the friend
   * you want to remove.
   */
  public async removeFriend(friendUID: string): Promise<void> {
    const myUid:string = sessionStorage.getItem("uid") || '';
    const usersDB = collection(this.firestore, "users");

    // Remove the current user's UID from the friend's myFollower array
    const friendQuery = query(usersDB, where("uid", "==", friendUID));
    const friendSnapshot = await getDocs(friendQuery);
    const friendProfile:ProfileUser = friendSnapshot.docs[0]?.data() as ProfileUser;
    if (friendProfile?.myFollower) {
      friendProfile.myFollower = friendProfile.myFollower.filter(item => item !== myUid);
      this.updateUser(friendProfile);
    }

    // Remove the friend's UID from the current user's iAmFollowing array
    const currentUserQuery = query(usersDB, where("uid", "==", myUid));
    const currentUserSnapshot = await getDocs(currentUserQuery);
    const currentUserProfile:ProfileUser = currentUserSnapshot.docs[0]?.data() as ProfileUser;
    if (currentUserProfile?.iAmFollowing) {
      currentUserProfile.iAmFollowing = currentUserProfile.iAmFollowing.filter((item:string):boolean => item !== friendUID);
      this.updateUser(currentUserProfile);
    }
  }


  /**
   * The function checks if a user is following another user based on the provided follower, followed, and type parameters.
   * @param {string} follower - The `follower` parameter is a string that represents the user who is potentially following
   * someone else.
   * @param {string} followed - The "followed" parameter is a string that represents the user being followed.
   * @param {string} type - The "type" parameter is a string that represents the type of follower. It is used to specify
   * which field in the user document contains the followers.
   * @returns a Promise that resolves to a boolean value.
   */
  public async amIFollowing(follower: string,followed: string,type: string): Promise<boolean>{
    let returnType: boolean = true;
    const usersDB = collection(this.firestore, "users");
    const q = query(usersDB, where("uid", "==", follower));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc): void => {
      const myFollower = doc.get(type) || [];
      if (myFollower.includes(followed,0)){
        returnType = false;
      }
    });
    return returnType;
  }

  /**
   * The function `checkAdminStatus` retrieves the admin status of a user from a Firestore database and returns it as a
   * boolean value.
   * @returns The function `checkAdminStatus` returns a boolean value.
   */
  public async checkAdminStatus(): Promise<boolean>{
    let myUid: string = sessionStorage.getItem("uid") || '';
    let returnType: boolean = false;
    const usersDB = collection(this.firestore, "users");
    const q = query(usersDB, where("uid", "==", myUid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc): void => {
      returnType = doc.get("admin");
      console.log("Admin: "+doc.get("admin"));
    });
    console.log("Admin Return: "+returnType);
    return returnType;
  }
}
