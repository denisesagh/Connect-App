import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { AuthService } from '../../shared/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);
  let dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, MatInputModule, MatButtonModule, MatDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialogRef, useValue: {} }, // mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} }, // mock MAT_DIALOG_DATA
        { provide: MatDialog, useValue: dialogSpy } // mock MatDialog
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
