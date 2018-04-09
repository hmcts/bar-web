import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

  static SECURITY_COOKIE = '__auth-token';

  constructor(private _cookieService: CookieService) {}

  public isAuthenticated(): boolean {
    const authCookie = this._cookieService.get(AuthService.SECURITY_COOKIE);
    if (authCookie) {
      return true;
    }
    return false;
  }

}

