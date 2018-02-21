import { UserModel } from '../../models/user.model';

export class LoginFormModel {
  email: string;
  passw: string;
  user: UserModel;

  constructor(userModel: UserModel) {
    this.email = userModel.email;
    this.passw = userModel.password;
    this.user = userModel;
  }

  getUser(): UserModel {
    return this.user;
  }
}
