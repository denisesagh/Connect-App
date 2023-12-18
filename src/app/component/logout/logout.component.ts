import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {Dialog} from "@angular/cdk/dialog";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent {

  constructor(public router: Router, private dialog: Dialog) { }

  @HostListener('window:open')
  openDialog() {
    document.body.classList.add('dimmed-background');
  }

  @HostListener('window:close')
   public closeDialog():void {
    document.body.classList.remove('dimmed-background');
  }


  /**
   * The `testCookieSetter` function sets a cookie in the browser's local storage.
   * @return {void} - This function does not return anything.
   * This function is used to test the functionality of the `logout` function.
   */
  testCookieSetter():void {
    localStorage.setItem('email', 'test');
  }

  /**
   * The `testCookies` function returns the value of the cookie set in the browser's local storage.
   * @return {string | null} - This function returns the value of the cookie set in the browser's local storage.
   * This function is used to test the functionality of the `logout` function.
   */
  testCookies():string | null {
    return localStorage.getItem('email')
  }


  /**
   * The `logout` function removes user-related data from local storage and navigates to the login page.
   */
  logout():void {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('username');
    localStorage.removeItem('uid');
    localStorage.removeItem('photoURL');
    localStorage.removeItem('displayName');
    localStorage.removeItem('emailVerified');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('refreshToken');

    this.dialog.closeAll();
    this.router.navigate(['/login']);
  }

  /**
   * The function "notLogout" closes all dialogs and navigates to the dashboard.
   */
  notLogout():void {
    this.dialog.closeAll();
    this.router.navigate(['dashboard']);
  }

}
