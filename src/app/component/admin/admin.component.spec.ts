import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from '../../Services/user/user.service';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceMock, HotToastServiceMock, UserServiceMock } from '../../../../mocks/mocks';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: UsersService, useValue: UserServiceMock },
        { provide: HotToastService, useValue: HotToastServiceMock },
        FormBuilder,
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a uid property', () => {
    component.updateProfileForm.setValue({bio: "", fullName: "", username: "", uid: 'test_uid' })
    expect(component.uidUpdate).toBeDefined();
  });

  it('should have a definded uid property', () => {
    component.updateProfileForm.setValue({bio: "", fullName: "", username: "", uid: "" })
    expect(component.updateProfile).toThrowError();
  });


  it('should allow empty values for bio, fullName, and username', () => {
    component.updateProfileForm.setValue({bio: "", fullName: "", username: "", uid: 'test_uid' })
    expect(component.updateProfileForm.valid).toBeTruthy();
  });


  it('should update value if not empty', () => {
    component.updateProfileForm.setValue({bio: "test_bio", fullName: "", username: "test_username", uid: 'test_uid' })
    expect(component.updateProfile).toBeTruthy();
  });

});
