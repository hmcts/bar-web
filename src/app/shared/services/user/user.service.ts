import { Injectable } from '@angular/core';
import 'rxjs/BehaviorSubject';
import { UserModel } from '../../../core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserService {
  static USER_COOKIE = '__user-info';

  constructor(private _cookieService: CookieService) {}

  getUser(): UserModel {
    const userCookie = this._cookieService.get(UserService.USER_COOKIE);
    if (!userCookie) {
      return null;
    }
    return new UserModel(JSON.parse(userCookie));
  }

  authenticate(userModel: UserModel): boolean {
    if (
      userModel.email === 'post.clerk@hmcts.net' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'fee.clerk@hmcts.net' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'seniorfee.clerk@hmcts.net' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'delivery.manager@hmcts.net' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'seniorfee.clerk2@hmcts.net' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'barpreprodpostclerk@mailinator.com' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'barpreprodfeeclerk@mailinator.com' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'barpreprodsrfeeclerk@mailinator.com' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    } else if (
      userModel.email === 'barpreprod@mailinator.com' &&
      userModel.password === 'password'
    ) {
      this.storeUser(userModel);
      return true;
    }
    return false;
  }

  storeUser(user: UserModel): void {
    this._cookieService.set(UserService.USER_COOKIE, JSON.stringify(user));
  }

  logOut(): void {
    this._cookieService.delete(UserService.USER_COOKIE);
  }
}
