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
  static usersSource = '375750,Chris-Post,Bromley,post.clerk.bromley@hmcts.net,bar-post-clerk\n' +
    '375751,Karen-Fee,Bromley,fee.clerk.bromley@hmcts.net,bar-fee-clerk\n' +
    '375752,James-Senior,Bromley,seniorfee.clerk.bromley@hmcts.net,bar-senior-clerk\n' +
    '375753,Dee-DM,Bromley,delivery.manager.bromley@hmcts.net,bar-delivery-manager\n' +
    '375754,Chris-Post,Milton,post.clerk.milton@hmcts.net,bar-post-clerk\n' +
    '375755,Karen-Fee,Milton,fee.clerk.milton@hmcts.net,bar-fee-clerk\n' +
    '375756,James-Senior,Milton,seniorfee.clerk.milton@hmcts.net,bar-senior-clerk\n' +
    '375757,Dee-DM,Milton,delivery.manager.milton@hmcts.net,bar-delivery-manager';

  @Output() onAuthenticated: EventEmitter<boolean> = new EventEmitter();
  users: UserModel[] = new Array<UserModel>();
  moreUsers = new Array<UserModel>();
  model: LoginFormModel;
  siteId = 'Y431';

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.users.push(
      new UserModel({
        id: 365750,
        courtId: 'BR01',
        email: 'post.clerk@hmcts.net',
        forename: 'Chris',
        surname: 'Spencer',
        password: 'password',
        roles: ['bar-post-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365751,
        courtId: 'BR02',
        email: 'fee.clerk@hmcts.net',
        forename: 'Karen',
        surname: 'Taylor',
        password: 'password',
        roles: ['bar-fee-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365752,
        courtId: 'BR03',
        email: 'seniorfee.clerk@hmcts.net',
        forename: 'James',
        surname: 'Black',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365753,
        courtId: 'BR04',
        email: 'delivery.manager@hmcts.net',
        forename: 'Dee',
        surname: 'Aliu',
        password: 'password',
        roles: ['bar-delivery-manager']
      })
    );

    this.users.push(
      new UserModel({
        id: 365756,
        courtId: 'BR03',
        email: 'seniorfee.clerk2@hmcts.net',
        forename: 'James2',
        surname: 'Black2',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365757,
        courtId: 'BR03',
        email: 'barpreprodpostclerk@mailinator.com',
        forename: 'Anjani',
        surname: 'PostClerk',
        password: 'password',
        roles: ['bar-post-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365758,
        courtId: 'BR02',
        email: 'barpreprodfeeclerk@mailinator.com',
        forename: 'Anish',
        surname: 'feeclerk',
        password: 'password',
        roles: ['bar-fee-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365759,
        courtId: 'BR03',
        email: 'barpreprodsrfeeclerk@mailinator.com',
        forename: 'krishna',
        surname: 'Srfeeclerk',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365760,
        courtId: 'BR04',
        email: 'barpreprod@mailinator.com',
        forename: 'PreProd',
        surname: 'Admin',
        password: 'password',
        roles: ['bar-delivery-manager']
      })
    );

    this.generateAdditionalUsers();
    this.model = new LoginFormModel(this.users[0]);
  }

  generateAdditionalUsers() {
    this.moreUsers = LoginFormComponent.usersSource.split('\n').map(line => line.split(',')).map(usr => {
      return new UserModel({ courtId: 'BRXX', email: usr[3], forename: usr[1], surname: usr[2],
                             password: '123456', roles: [usr[4]], id: usr[0]});
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.findUser(this.model.email);
    const authenticate = this._userService.authenticate(this.model.getUser(), this.siteId);
    this.onAuthenticated.emit(authenticate);
  }

  findUser(email: string) {
    const userModel: UserModel | undefined = this.users.concat(this.moreUsers).find(user => user.email === email);
    if (userModel) {
      this.model = new LoginFormModel(userModel);
    }
  }

  selectUser(userModel: UserModel) {
    this.model = new LoginFormModel(userModel);
  }
}
