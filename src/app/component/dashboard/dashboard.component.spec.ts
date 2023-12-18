import { ComponentFixture, TestBed } from '@angular/core/testing';
import {DbServiceService} from "../../Services/database/db-service.service";
import { DashboardComponent } from './dashboard.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AuthService} from "../../shared/auth.service";
import {UsersService} from "../../Services/user/user.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let dialog: MatDialog;
  let firebaseStorageService: DbServiceService;
  let auth: AuthService;
  let userService: UsersService;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    firebaseStorageService = jasmine.createSpyObj('DbServiceService', ['getAllPostsFromDB']);
    auth = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    userService = jasmine.createSpyObj('UsersService', ['checkAdminStatus']);
    component = new DashboardComponent(dialog, firebaseStorageService, auth, userService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the feed section by default', () => {
    expect(component.showFeed).toBeTruthy();
    expect(component.showProfile).toBeFalsy();
  });

  it('should open the requested section', () => {
    component.openBody('Profil');
    expect(component.showProfile).toBeTruthy();
    expect(component.showFeed).toBeFalsy();

    component.openBody('Post erstellen');
    expect(component.showCreatePost).toBeTruthy();
    expect(component.showProfile).toBeFalsy();

    component.openBody('Suche');
    expect(component.showSearch).toBeTruthy();
    expect(component.showFeed).toBeFalsy();

    component.openBody('Einstellungen');
    expect(component.showSettings).toBeTruthy();
    expect(component.showFeed).toBeFalsy();

    component.openBody('Admin');
    expect(component.showAdmin).toBeTruthy();
    expect(component.showFeed).toBeFalsy();

    component.openBody('Benachrichtigungen');
    expect(component.showNotificationFeed).toBeTruthy();
    expect(component.showFeed).toBeFalsy();

    //...

  });



});
