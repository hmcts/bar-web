import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { UserModel } from '../../models/user.model';

let mockRouter: any;
let latestUrl: string;
const user: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR01',
  sub: 'email@hmcts.net',
  given_name: 'Users',
  family_name: 'Fullname',
  password: 'password',
  roles: ['bar-fee-clerk']
});

class MockRouter {
  navigateByUrl(url: string) {
    latestUrl = url;
    return url;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    mockRouter = new MockRouter();
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RouterModule ],
      declarations: [ LoginComponent, LoginFormComponent ]
    }).overrideComponent(LoginComponent, {
      set: {
        providers: [
          { provide: Router, useClass: MockRouter },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should be created and fwded to feelog', () => {
    expect(component).toBeTruthy();
    expect(latestUrl).toBe('/feelog');
  });

  it('post clerk should be fwded to /dashboard', () => {
    user.roles = ['bar-post-clerk'];
    spyOn(userService, 'getUser').and.returnValue(user);
    component.handleLoginStatus(true);
    expect(latestUrl).toBe('/dashboard');
  });

  it('senior clerk should be fwded to /payment-overview', () => {
    user.roles = ['bar-senior-clerk'];
    spyOn(userService, 'getUser').and.returnValue(user);
    component.handleLoginStatus(true);
    expect(latestUrl).toBe('/payment-overview');
  });

  it('delivery manager should be fwded to /payment-overview', () => {
    user.roles = ['bar-delivery-manager'];
    spyOn(userService, 'getUser').and.returnValue(user);
    component.handleLoginStatus(true);
    expect(latestUrl).toBe('/payment-overview');
  });

  it('when no authenticated user', () => {
    spyOn(userService, 'getUser').and.returnValue(null);
    spyOn(router, 'navigateByUrl');
    component.handleLoginStatus(true);
    expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
  });
});
