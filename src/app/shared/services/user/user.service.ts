import { Injectable } from '@angular/core';
import 'rxjs/BehaviorSubject';
import { UserModel } from '../../../core/models/user.model';

@Injectable()
export class UserService {
  getUser() {
    if (localStorage.getItem('user') === null) {
      return false;
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  authenticate(userModel: UserModel): boolean {
    if (userModel.email === 'post.clerk@hmcts.net' && userModel.password === 'password') {
      this.storeUser(userModel);
      return true;
    } else if (userModel.email === 'fee.clerk@hmcts.net' && userModel.password === 'password') {
      this.storeUser(userModel);
      return true;
    } else if (userModel.email === 'seniorfee.clerk@hmcts.net' && userModel.password === 'password') {
      this.storeUser(userModel);
      return true;
    } else if (userModel.email === 'delivery.manager@hmcts.net' && userModel.password === 'password') {
      this.storeUser(userModel);
      return true;
    }
    return false;
  }

  storeUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logOut(): void {
    localStorage.removeItem('user');
  }

}
