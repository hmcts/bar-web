import { Injectable } from '@angular/core';
import {} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  private user: any = false;

  constructor() { }

  getUser() {
    if (localStorage.getItem('user') === null) {
      return false;
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  authenticate({ email, passw }): boolean {
    if (email === 'chris.spencer@hmcts.net' && passw === 'password') {
      this.storeUser({
        fullName: 'Chris Spencer',
        email: email,
        courtId: 'BR01',
        role: 'clerk'
      });
      return true;
    } else if (email === 'fee.clerk@hmcts.net' && passw === 'password') {
      this.storeUser({
        fullName: 'Fee Clerk',
        email: email,
        courtId: 'BR02',
        role: 'feeclerk'
      });
      return true;
    }
    return false;
  }

  clearUser(): void {
    this.user.email = '';
  }

  storeUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logOut() {
    this.user = false;
    localStorage.removeItem('user');
  }

}
