import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Auth } from '@angular/fire/auth';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  let authServiceMock = jasmine.createSpyObj('AuthService', ['resetPassword']);
  let authMock = jasmine.createSpyObj('Auth', ['signInWithEmailAndPassword']); // create a spy for Auth service
  let authMock2 = jasmine.createSpyObj('Auth', ['forgotPassword']); // create a spy for Auth service

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Auth, useValue: authMock } // provide the mocked Auth service
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test_forgot_password_calls_auth_service', () => {
    const component = new ForgotPasswordComponent(authMock2);
    component.email = 'test@example.com';
    component.forgotPassword();
    expect(authMock2.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('test_email_field_cleared_after_forgot_password', () => {
    const component = new ForgotPasswordComponent(authMock2);
    component.email = 'test@example.com';
    component.forgotPassword();
    expect(component.email).toEqual('');
  });

});
