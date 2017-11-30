import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private user: any = false;

  constructor() { }

  getUser() {
    return this.user;
  }

  authenticate({ email, passw }): boolean {
    if (email === 'chris.spencer@hmcts.net' && passw === 'password') {
      this.user = { fullName: 'Chris Spencer', email: email, courtId: 'BR01', role: 'clerk' };
      return true;
    } else if (email === 'fee.clerk@hmcts.net' && passw === 'password') {
      this.user = { fullName: 'Fee Clerk', email: email, courtId: 'BR02', role: 'feeclerk' };
      return true;
    }
    return false;
  }

  clearUser(): void {
    this.user.email = '';
  }

}
