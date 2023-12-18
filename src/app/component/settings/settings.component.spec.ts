import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from '../../Services/user/user.service';
import { AuthService } from '../../shared/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { SettingsComponent } from './settings.component';
import { UserSettings } from '../../Model/UserSettings';
import {of} from "rxjs";



describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockHotToastService: jasmine.SpyObj<HotToastService>;


  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'deleteUser']);
    const hotToastServiceSpy = jasmine.createSpyObj('HotToastService', ['observe']);
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['getUserSettings', 'updateUserSettings', 'updateUser', 'currentUserProfile$', 'currentUserSettings$']);


    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SettingsComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HotToastService, useValue: hotToastServiceSpy },
      ],
    }).compileComponents();

    // Set up a mock user and user settings
    const mockUser = { uid: '12345' };
    const mockSettings: UserSettings[] = [
      { settingID: 'setting1', settingValue: true },
      { settingID: 'setting2', settingValue: false },
    ];

    userServiceSpy.currentUserProfile$ = of(mockUser);
    userServiceSpy.currentUserSettings$ = of(mockSettings);

    mockUsersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockHotToastService = TestBed.inject(HotToastService) as jasmine.SpyObj<HotToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct user settings', () => {
    expect(component.settings.length).toEqual(2);
    expect(component.settings[0].settingID).toEqual('setting1');
    expect(component.settings[0].settingValue).toEqual(true);
    expect(component.settings[1].settingID).toEqual('setting2');
    expect(component.settings[1].settingValue).toEqual(false);
  });

  it('should update the user settings on switch change', () => {
    const changedSetting: UserSettings = { settingID: 'setting1', settingValue: false };
    component.onSwitchChanged(changedSetting);

    expect(mockUsersService.updateUser).toHaveBeenCalledWith({
      uid: '12345',
      settings: [
        { settingID: 'setting1', settingValue: false },
        { settingID: 'setting2', settingValue: false },
      ],
    });
  });



  it('should call deleteUser on AuthService', () => {
    component.deleteUser();

    expect(mockAuthService.deleteUser).toHaveBeenCalled();
  });
});
