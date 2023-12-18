import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageUploadService } from 'src/app/Services/image/image-upload.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/Services/user/user.service';

import { ProfileComponent } from './profile.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const AuthServiceMock = {};
  const UserServiceMock = {
    currentUserProfile$: of({uid: '1234', /*...provide the necessary user profile properties...*/})
  };
  const HotToastServiceMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: ImageUploadService, useValue: AuthServiceMock },
        { provide: UsersService, useValue: UserServiceMock },
        { provide: HotToastService, useValue: HotToastServiceMock },
        FormBuilder,
      ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
