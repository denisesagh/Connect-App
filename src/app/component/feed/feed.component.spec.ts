import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FeedComponent } from './feed.component';
import { UsersService } from '../../Services/user/user.service';
import { StorageService } from '../../Services/storage/storage.service';
import { DbServiceService } from '../../Services/database/db-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['updateUser']);
    userServiceSpy.currentUserProfile$ = of({ uid: '1234' });

    const dbServiceSpy = jasmine.createSpyObj('DbServiceService', ['getAllPostsFromDB', 'getAllPostsFromDBByUID', 'countLikes']);
    const dashboardSpy = jasmine.createSpyObj('DashboardComponent', ['openBody']);

    TestBed.configureTestingModule({
      declarations: [FeedComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: DbServiceService, useValue: dbServiceSpy },
        { provide: DashboardComponent, useValue: dashboardSpy },
        StorageService,
      ]
    });

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
