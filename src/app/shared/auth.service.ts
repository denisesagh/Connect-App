/**

import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from "@angular/router";
import {DashboardComponent} from "../component/dashboard/dashboard.component";
import {User} from "../Model/User";
@Injectable({
  providedIn: 'root'
})
export class AuthService{

  public currentUser: User | null = null;


  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  //Loginmethode
  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Benutzer erfolgreich eingeloggt
        const user = userCredential.user;
        if (user) {
          const username = user.displayName;
          // Hier kannst du den Benutzernamen verwenden oder weiterverarbeiten
          this.router.navigate(['/dashboard']);
          user.getIdToken().then(token => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userID', user.uid);
            if(user?.displayName){
              localStorage.setItem('username', user.displayName);
            }
          }, err => {
            alert(err.message);
            console.log(err);
          });


          console.log("Benutzername:", username);
          if (user?.displayName == null) {
            alert("Achtung, nutzername ist Null")
          }
        } else {
          alert("Etwas ist schief gelaufen")
        }
      })
      .catch(err => {
        // Fehler beim Einloggen
        alert(err.message);
        this.router.navigate(['/login']);
        console.log(err);
      });
  }


  //Registermethode
  register(email: string, password: string, username: string){
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Benutzer erfolgreich registriert
        const user = userCredential.user;

        if (user) {
          // Speichern des Benutzernamens in der Benutzerdatenbank
          return user.updateProfile({
            displayName: username
          });
        } else {
          throw new Error("Benutzerobjekt ist null");
        }
      })
      .then(() => {
        // Benutzername erfolgreich gespeichert
        alert("Registrierung erfolgreich");
        this.router.navigate(['/login']);
      })
      .catch(err => {
        // Fehler bei der Registrierung oder beim Speichern des Benutzernamens
        alert(err.message);
        this.router.navigate(['/register']);
        console.log(err);
      });
  }

  //Logoutmethode
  logout(){
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }

  //forogt password
  forgotPassword(email: string){
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      alert("Zurücksetz Email wurde gesendet");
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }



}
*/

import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* The line `currentUser$:Observable<any | null> = authState(this.auth);` is creating an observable called `currentUser$`
  that represents the current authenticated user. It uses the `authState` function from the `@angular/fire/auth` library
  to listen for changes in the authentication state. */
  currentUser$:Observable<any | null> = authState(this.auth);

  /**
   * This constructor takes in three parameters (auth, fireauth, and router) and assigns them to private properties of the
   * class.
   * @param {Auth} auth - The `auth` parameter is an instance of the `Auth` class, which is used for authentication
   * purposes in the application. It likely provides methods for user authentication, such as login, logout, and
   * registration.
   * @param {AngularFireAuth} fireauth - The `fireauth` parameter is an instance of the `AngularFireAuth` service, which
   * provides authentication functionality for Firebase in Angular applications. It allows you to authenticate users,
   * manage user sessions, and perform other authentication-related tasks.
   * @param {Router} router - The `router` parameter is an instance of the `Router` class from the Angular Router module.
   * It is used for navigating between different routes in your application.
   */
  constructor(private auth: Auth, private fireauth: AngularFireAuth, private router: Router) {}

  /**
   * The function "register" takes an email and password as parameters, creates a user with the provided email and password
   * using the "createUserWithEmailAndPassword" function, and returns an Observable of type "UserCredential".
   * @param {string} email - A string representing the email address of the user.
   * @param {string} password - The password parameter is a string that represents the user's password.
   * @returns an Observable of type UserCredential.
   */
  public register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * The login function takes an email and password as parameters, sets the "uid" value in sessionStorage to an empty
   * string, attempts to sign in with the provided email and password, and returns an Observable.
   * @param {string} email - The email parameter is a string that represents the user's email address.
   * @param {string} password - The password parameter is a string that represents the user's password.
   * @returns an Observable<any>.
   */
  public login(email: string, password: string): Observable<any> {
    sessionStorage.setItem("uid", "");
    signInWithEmailAndPassword(this.auth,email,password).then((userCredentials:UserCredential):void=>{const user = userCredentials.user; {
      if (user){
        sessionStorage.setItem("uid", user.uid);
      }
    }});
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * The function logs out the user and returns an Observable.
   * @returns The logout function returns an Observable that emits the result of the signOut() method from the auth object.
   */
  public logout(): Observable<any> {
    return from(this.auth.signOut());
  }


  /**
   * The `forgotPassword` function sends a password reset email to the provided email address and displays an alert message
   * accordingly.
   * @param {string} email - The email parameter is a string that represents the user's email address.
   */
  public forgotPassword(email: string):void{
    this.fireauth.sendPasswordResetEmail(email).then(():void => {
      alert("Zurücksetz Email wurde gesendet");
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }

  /**
   * The deleteUser function deletes the current user, logs a success message, and navigates to the login page.
   */
  public deleteUser():void {
    const user:Promise<any | null> = this.fireauth.currentUser;

    user.then((currentUser):void => {
      if (currentUser) {
        currentUser.delete().then(():void => {
          console.log('User deleted successfully');
          this.router.navigate(['/login']).then(
            ():void => {
              window.location.reload();
            }
          );
        }).catch((error:Error):void => {
          console.error('Error deleting user', error);
        });
      }
    });
  }
}
