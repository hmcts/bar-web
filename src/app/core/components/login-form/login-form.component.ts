import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginFormModel } from './login-form.model';
import { UserService } from '../../../shared/services/user/user.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @Output() onAuthenticated: EventEmitter<boolean> = new EventEmitter;
  users: UserModel[] = new Array<UserModel>();
  model: LoginFormModel;

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.users.push(new UserModel({
      courtId: 'BR01',
      email: 'post.clerk@hmcts.net',
      fullName: 'Chris Spencer',
      password: 'password',
      type: 'postclerk',
      typeText: 'Post Clerk'
    }));

    this.users.push(new UserModel({
      courtId: 'BR02',
      email: 'fee.clerk@hmcts.net',
      fullName: 'Karen Taylor',
      password: 'password',
      type: 'feeclerk',
      typeText: 'Fee Clerk'
    }));

    this.users.push(new UserModel({
      courtId: 'BR03',
      email: 'seniorfee.clerk@hmcts.net',
      fullName: 'James Black',
      password: 'password',
      type: 'seniorfeeclerk',
      typeText: 'Senior Clerk'
    }));

    this.users.push(new UserModel({
      courtId: 'BR04',
      email: 'delivery.manager@hmcts.net',
      fullName: 'Dee Aliu',
      password: 'password',
      type: 'deliverymanager',
      typeText: 'Delivery Manager'
    }));

    this.model = new LoginFormModel( this.users[0] );
  }

  onSubmit($ev) {
    $ev.preventDefault();
    const authenticate = this._userService.authenticate( this.model.getUser() );
    this.onAuthenticated.emit(authenticate);
  }

  selectUser(userModel: UserModel) {
    this.model = new LoginFormModel( userModel );
  }

}
