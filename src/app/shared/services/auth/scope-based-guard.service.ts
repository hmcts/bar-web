import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user/user.service';
import { environment } from '../../../../environments/environment';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class ScopeBasedGuardService implements CanActivate {

  constructor(
    private _cookieService: CookieService,
    private _userService: UserService,
    private _http: BarHttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean  {
    const scope = this._cookieService.get(UserService.USER_SCOPE_COOKIE);
    if (scope) {
      return true;
    }
    this._userService.logOut();
    this._cookieService.set(UserService.USER_SCOPE_COOKIE, 'create-user');
    this._http.get('/api/invalidate-token').subscribe(() => { window.location.href = '/login'; });
    return false;
  }

}