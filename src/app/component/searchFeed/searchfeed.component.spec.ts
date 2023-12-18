import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchfeedComponent } from './searchfeed.component';
import {AdminComponent} from "../admin/admin.component";
import {AuthService} from "../../shared/auth.service";
import {AuthServiceMock, HotToastServiceMock, UserServiceMock} from "../../../../mocks/mocks";
import {UsersService} from "../../Services/user/user.service";
import {HotToastService} from "@ngneat/hot-toast";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";

describe('SearchfeedComponent', () => {
  let component: SearchfeedComponent;
  let fixture: ComponentFixture<SearchfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchfeedComponent],
      providers: [
        { provide: UsersService, useValue: UserServiceMock },
        FormBuilder,
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close subscription on destroy', () => {
    component.ngOnDestroy();
    expect(component.formDataSubscribtion.closed).toBeTruthy();
  });



});
