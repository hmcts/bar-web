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
      this.user = { fullName: 'Chris Spencer', email: email };
      return true;
    }
    return false;
  }

  clearUser(): void {
    this.user.email = '';
  }

}
