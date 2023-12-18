import {of} from "rxjs";


export class AuthServiceMock {
// Implement only the methods used in the test
    public currentUser$ = {
      uid: 'test_uid'
    };

    public login = jasmine.createSpy('login')
      .and.returnValue(Promise.resolve());

    public pipe = jasmine.createSpy('pipe')
  }


  export class HotToastServiceMock {
    public success = jasmine.createSpy('success');
    public error = jasmine.createSpy('error');
  }


  export class UserServiceMock {
    public updateUserProfile = jasmine.createSpy('updateUserProfile')
      .and.returnValue(Promise.resolve());

    public addFriend = jasmine.createSpy('addFriend')


  }

  export const UserServiceCurrentUserProfileMock = {
    currentUserProfile$: of(null),
    then: of (null),

    removeFriend: jasmine.createSpy('removeFriend')
  }

  export class FireStorageMock {
    public upload = jasmine.createSpy('upload')
      .and.returnValue(Promise.resolve());
  }

  export class DBServiceServiceMock {
    public upload = jasmine.createSpy('upload')
      .and.returnValue(Promise.resolve());
  }


  export class RouterMock {
    public navigate = jasmine.createSpy('navigate');
  }
