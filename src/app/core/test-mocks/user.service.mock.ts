import { UserModel } from '../models/user.model';

export class UserServiceMock {
  user: UserModel = new UserModel({
    uid: 365750,
    courtId: 'BR01',
    sub: 'email@hmcts.net',
    given_name: 'Users',
    family_name: 'Fullname',
    password: 'password',
    roles: ['bar-fee-clerk']
  });

  getUser(): UserModel {
    return this.user;
  }

  authenticate(user: UserModel) {
    return true;
  }

  logOut(): void {

  }
}
