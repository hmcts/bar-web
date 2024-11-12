import { UserModel } from '../../models/user.model';
import {LoginFormComponent} from "./login-form.component";

export class LoginFormModel {
  email: string;
  passw: string;
  user: UserModel;

  constructor(userModel: UserModel) {
    this.email = userModel.email;
    this.passw = LoginFormComponent.decrypt(userModel.password);
    this.user = userModel;
  }

  getUser(): UserModel {
    return this.user;
  }
}
