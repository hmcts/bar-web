import { RoleGuardService } from './role-guard.service';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../core/models/user.model';

describe('RoleGuardServiceTest', () => {
  let service: RoleGuardService;
  let mockActivatedRouteSnapshot: any;
  let user: UserModel;
  let routerSpy: any;

  beforeEach(() => {
    user = new UserModel({courtId: 'A', email: 'user1@gmail.com', forename: 'user',
    surname: 'one', password: '', roles: ['bar-post-clerk']});

    const authServiceSpy: any = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const userServiceSpy: any = jasmine.createSpyObj('UserService', ['getUser']);
    userServiceSpy.getUser.and.returnValue(user);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.callFake(url => {
      return url;
    });

    class MockActivatedRouteSnapshot {
      private _data: any;
      get data(){
         return this._data;
      }
    }

    service = new RoleGuardService(authServiceSpy, routerSpy, userServiceSpy);
  });

  it('User has the proper role and can login', () => {
    mockActivatedRouteSnapshot = {
      data: {
        expectedRoles: ['bar-post-clerk']
      }
    };

    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(true);
  });

  it('User doesnt have the proper role and can login', () => {
    mockActivatedRouteSnapshot = {
      data: {
        expectedRoles: ['bar-fee-clerk']
      }
    };

    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(false);
    expect(routerSpy.navigate.calls.count()).toBe(1, 'spy method was called once');
    expect(routerSpy.navigate.calls.mostRecent().returnValue).toEqual(['error', 403]);
  });

});
