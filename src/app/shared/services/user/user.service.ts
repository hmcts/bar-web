import { Injectable } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserService {
  static USER_COOKIE = '__user-info';
  static SITEID_COOKIE = '__site-id';
  static AUTH_TOKEN = '__auth-token';
  static USER_SCOPE_COOKIE = '__user_scope';

  static USERS = ['post.clerk@hmcts.net', 'fee.clerk@hmcts.net', 'seniorfee.clerk@hmcts.net', 'delivery.manager@hmcts.net',
    'seniorfee.clerk2@hmcts.net', 'barpreprodpostclerk@mailinator.com', 'barpreprodfeeclerk@mailinator.com',
    'barpreprodsrfeeclerk@mailinator.com', 'barpreprod@mailinator.com', 'post.clerk.bromley@hmcts.net', 'fee.clerk.bromley@hmcts.net',
    'seniorfee.clerk.bromley@hmcts.net', 'delivery.manager.bromley@hmcts.net', 'post.clerk.milton@hmcts.net', 'fee.clerk.milton@hmcts.net',
    'seniorfee.clerk.milton@hmcts.net', 'delivery.manager.milton@hmcts.net', 'site2feeclerk@mailinator.com', 'SiteSwitchFee@mailnesia.com',
    'SiteSwitchDM@mailnesia.com', 'SiteSwitchSrFee@mailnesia.com', 'SiteSwitchPost@mailnesia.com', 'bardemodm@mailnesia.com', 'bardemosrfee@mailnesia.com'];

  constructor(private _cookieService: CookieService) {}

  getUser(): UserModel {
    const userCookie = this._cookieService.get(UserService.USER_COOKIE);
    if (!userCookie) {
      return null;
    }
    return new UserModel(JSON.parse(userCookie));
  }

  authenticate(userModel: UserModel, siteIds: string[]): boolean {
    if (UserService.USERS.includes(userModel.email)) {
      console.log('authenticate', siteIds);
      this.storeUser(userModel, siteIds);
      return true;
    }
    return false;
  }

  storeUser(user: UserModel, siteIds: string[]): void {
    this._cookieService.set(UserService.USER_COOKIE, JSON.stringify(user));
    const prevCookie = this._cookieService.get(UserService.SITEID_COOKIE);
    let siteId;
    if (siteIds.includes(prevCookie)) {
      siteId = prevCookie;
    } else {
      siteId = siteIds[0];
    }
    console.log('user cookie', UserService.SITEID_COOKIE);
    this._cookieService.set(UserService.SITEID_COOKIE, siteId);
    this._cookieService.set(UserService.AUTH_TOKEN, user.email);
  }

  logOut(): void {
    this._cookieService.delete(UserService.USER_COOKIE);
    this._cookieService.delete(UserService.USER_SCOPE_COOKIE);
  }
}
