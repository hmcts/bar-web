import { Injectable } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserService {
  static USER_COOKIE = '__user-info';
  static SITEID_COOKIE = '__site-id';
  static AUTH_TOKEN = '__auth-token';
  static USERS = ['post.clerk@hmcts.net', 'fee.clerk@hmcts.net', 'seniorfee.clerk@hmcts.net', 'delivery.manager@hmcts.net',
    'seniorfee.clerk2@hmcts.net', 'barpreprodpostclerk@mailinator.com', 'barpreprodfeeclerk@mailinator.com',
    'barpreprodsrfeeclerk@mailinator.com', 'barpreprod@mailinator.com', 'post.clerk.bromley@hmcts.net', 'fee.clerk.bromley@hmcts.net',
    'seniorfee.clerk.bromley@hmcts.net', 'delivery.manager.bromley@hmcts.net', 'post.clerk.milton@hmcts.net', 'fee.clerk.milton@hmcts.net',
    'seniorfee.clerk.milton@hmcts.net', 'delivery.manager.milton@hmcts.net', 'site2feeclerk@mailinator.com'];

  constructor(private _cookieService: CookieService) {}

  getUser(): UserModel {
    const userCookie = this._cookieService.get(UserService.USER_COOKIE);
    if (!userCookie) {
      return null;
    }
    return new UserModel(JSON.parse(userCookie));
  }

  authenticate(userModel: UserModel, siteId: string): boolean {
    if (UserService.USERS.includes(userModel.email)) {
      this.storeUser(userModel, siteId);
      return true;
    }
    return false;
  }

  storeUser(user: UserModel, siteId: string): void {
    this._cookieService.set(UserService.USER_COOKIE, JSON.stringify(user));
    const prevCookie = this._cookieService.get(UserService.SITEID_COOKIE);
    this._cookieService.set(UserService.SITEID_COOKIE, prevCookie ? prevCookie : siteId);
    this._cookieService.set(UserService.AUTH_TOKEN, user.email);
  }

  logOut(): void {
    this._cookieService.delete(UserService.USER_COOKIE);
    this._cookieService.delete(UserService.AUTH_TOKEN);
  }
}
