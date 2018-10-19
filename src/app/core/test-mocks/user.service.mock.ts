import { UserModel } from '../models/user.model';

export class UserServiceMock {
  user: UserModel = new UserModel({
    id: 365750,
    courtId: 'BR01',
    email: 'email@hmcts.net',
    forename: 'Users',
    surname: 'Fullname',
    password: 'password',
    roles: ['bar-fee-clerk']
  });

  getUser(): UserModel {
    return this.user;
  }

  authenticate(user: UserModel) {
    return true;
  }
}
