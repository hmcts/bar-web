import { UserModel } from '../../models/user.model';
import {LoginFormComponent} from "./login-form.component";
import {EncryptionUtils} from "../../../shared/security/security-utils";

export class LoginFormModel {
  email: string;
  passw: string;
  user: UserModel;

  constructor(userModel: UserModel) {
    this.email = userModel.email;
    this.passw = EncryptionUtils.decrypt(userModel.password);
    this.user = userModel;
  }

  getUser(): UserModel {
    return this.user;
  }
}
