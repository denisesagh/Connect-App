import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { CreatePostComponent } from './create-post.component';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatDialog} from "@angular/material/dialog";
import {HotToastService} from "@ngneat/hot-toast";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {UsersService} from "../../Services/user/user.service";
import { FormsModule } from '@angular/forms';
import {of} from "rxjs";


describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CreatePostComponent],
      providers: [
        { provide: AngularFireStorageModule, useValue: { } }, // Provide a mock AuthService
        { provide: AngularFireStorage, useValue: {} } , // Provide a mock Firestore
        { provide: AngularFireDatabase, useValue: {} }, // Provide a mock Firestore
        { provide: MatDialog, useValue: {} }, // Provide a mock Firestore
        { provide: HotToastService, useValue: {} }, // Provide a mock Firestore
        { provide: DashboardComponent, useValue: {} }, // Provide a mock Firestore
        { provide: UsersService, useValue: {} }, // Provide a mock Firestore
      ],
    });
    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


//no none-DB related tests or none-front-end tests







});
