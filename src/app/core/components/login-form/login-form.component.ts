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
      id: 365750,
      courtId: 'BR01',
      email: 'post.clerk@hmcts.net',
      forename: 'Chris',
      surname: 'Spencer',
      password: 'password',
      roles: ['bar-post-clerk']
    }));

    this.users.push(new UserModel({
      id: 365751,
      courtId: 'BR02',
      email: 'fee.clerk@hmcts.net',
      forename: 'Karen',
      surname: 'Taylor',
      password: 'password',
      roles: ['bar-fee-clerk']
    }));

    this.users.push(new UserModel({
      id: 365752,
      courtId: 'BR03',
      email: 'seniorfee.clerk@hmcts.net',
      forename: 'James',
      surname: 'Black',
      password: 'password',
      roles: ['bar-senior-clerk']
    }));

    this.users.push(new UserModel({
      id: 365753,
      courtId: 'BR04',
      email: 'delivery.manager@hmcts.net',
      forename: 'Dee',
      surname: 'Aliu',
      password: 'password',
      roles: ['bar-delivery-manager']
    }));

    this.users.push(new UserModel({
      id: 365756,
      courtId: 'BR03',
      email: 'seniorfee.clerk2@hmcts.net',
      forename: 'James2',
      surname: 'Black2',
      password: 'password',
      roles: ['bar-senior-clerk']
    }));

    this.model = new LoginFormModel( this.users[0] );
  }

  onSubmit($ev) {
    $ev.preventDefault();
    console.log( this.model.getUser() );
    const authenticate = this._userService.authenticate( this.model.getUser() );
    this.onAuthenticated.emit(authenticate);
  }

  selectUser(userModel: UserModel) {
    this.model = new LoginFormModel( userModel );
  }

}
