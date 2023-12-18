import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HotToastService} from "@ngneat/hot-toast";
import {UsersService} from "../../Services/user/user.service";
import {AuthService} from "../../shared/auth.service";
import {AuthServiceMock, HotToastServiceMock, UserServiceMock} from "../../../../mocks/mocks";
import {RouterTestingModule} from "@angular/router/testing";
import {MatRippleModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: UsersService, useValue: UserServiceMock },
        { provide: HotToastService, useValue: {error: () => {} } },
        {provide: Router , useValue: {navigate: () => {} } },
        {provide: AuthService, useValue: {register: () => {}, pipe: () => {} }},
        FormBuilder
      ],
      imports: [RouterTestingModule, ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,],
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow empty fields', () => {
    expect(component.signUpForm.valid).toBeFalsy();
  });

  it('valid should be true when all fields are filled', () => {
    component.setProfileFormTest();
    expect(component.signUpForm.valid).toBeTruthy();
  });

});

