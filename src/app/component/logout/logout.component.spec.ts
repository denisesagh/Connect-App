import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { LogoutComponent } from './logout.component';
import {Router} from "@angular/router";

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: Router, useValue: {navigate: () => {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete all cookies on logout', () => {
    component.testCookieSetter()
    expect(component.testCookies.call(this)).toEqual('test');
    component.logout();
    expect(component.testCookies.call(this)).toEqual(null);

  });

  it('should navigate to home on logout', () => {
    spyOn(component.router, 'navigate')
    component.logout();
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to dashboard on notLogout', () => {
    spyOn(component.router, 'navigate')
    component.notLogout();
    expect(component.router.navigate).toHaveBeenCalledWith(['dashboard']);
  });

});
