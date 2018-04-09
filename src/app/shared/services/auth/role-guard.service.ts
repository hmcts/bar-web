import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RoleGuardService implements CanActivate {

  static USER_COOKIE = '__user-info';

  constructor(private _auth: AuthService, private _router: Router, private _cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRoles: Array<string> = route.data.expectedRoles;

    const userCookie = this._cookieService.get(RoleGuardService.USER_COOKIE);
    if (!this._auth.isAuthenticated() || !userCookie) {
      this._router.navigate(['login']);
      return false;
    }
    const user = JSON.parse(userCookie);
    const matchingRole = expectedRoles.some(role => user.roles.some(uRole => role === uRole));

    if (matchingRole) {
      return true;
    }
    this._router.navigate(['login']);
    return false;
  }

}
