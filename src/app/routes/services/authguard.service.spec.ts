import { AuthService } from '../../shared/services/auth/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './authguard.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { mock, instance } from 'ts-mockito';

describe('AuthGuard', () => {
  let authService: AuthService;
  let authGuard: AuthGuard;
  let router: Router;
  let state: RouterStateSnapshot;
  let route: ActivatedRouteSnapshot;
  let cookieService: CookieService;

  beforeEach(() => {
    authService = new AuthService(new UserService(cookieService));
    router = instance(mock(Router));
    authGuard = new AuthGuard(authService, router);
    state = instance(mock(RouterStateSnapshot));
    route = instance(mock(ActivatedRouteSnapshot));
  });

  it('when user is athenticated then we should receive true', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    expect(authGuard.canActivate(route, state)).toBeTruthy();
  });

  it('when user is NOT athenticated then should be redirected to login', () => {
    //@ts-ignore
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    //@ts-ignore
    spyOn(router, 'navigate').and.callFake(param => {
      expect(param).toEqual(['/login']);
    });
    authGuard.canActivate(route, state);
  });


});
