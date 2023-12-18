import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from '../../Services/user/user.service';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthServiceMock,
  HotToastServiceMock,
  UserServiceCurrentUserProfileMock,
  UserServiceMock
} from '../../../../mocks/mocks';
import {FriendlistComponent} from "./friendlist.component";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {ExternProfileComponent} from "../extern-profile/extern-profile.component";
import {of} from "rxjs";

describe('FriendslistComponent', () => {
  let component: FriendlistComponent;
  let fixture: ComponentFixture<FriendlistComponent>;
  let mockUserServices = jasmine.createSpyObj('UserService', ['setMessage']);
  let mockDashBoard = jasmine.createSpyObj('DashboardComponent', ['constructor']);
  let mockExternProfile = jasmine.createSpyObj('ExternProfileComponent', ['constructor']);
  let mockStorageService = jasmine.createSpyObj('StorageService', ['constructor']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendlistComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: UsersService, useValue: UserServiceCurrentUserProfileMock },
        { provide: HotToastService, useValue: HotToastServiceMock },
        { provide: DashboardComponent, useValue: {openBody: () => {}} },
        { provide: ExternProfileComponent, useValue: {ngOnInit: () => {}, ngOnDestroy: () => {}}},
        FormBuilder,
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(FriendlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a friend profile', () => {
    spyOn(component.dashboardComponent, 'openBody');
    component.profilAufrufen("test");
    expect(component.storageService.setStorageItem).toHaveBeenCalled;
    expect(component.dashboardComponent.openBody).toHaveBeenCalledWith('Externes Profil');
  });


});
