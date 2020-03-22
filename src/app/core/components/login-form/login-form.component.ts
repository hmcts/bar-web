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

  @Output() onAuthenticated: EventEmitter<boolean> = new EventEmitter();
  users: UserModel[] = new Array<UserModel>();
  model: LoginFormModel;
  userSite = {
    Y431: ['post.clerk@hmcts.net', 'fee.clerk@hmcts.net', 'seniorfee.clerk@hmcts.net', 'delivery.manager@hmcts.net',
    'seniorfee.clerk2@hmcts.net', 'barpreprodpostclerk@mailinator.com', 'barpreprodfeeclerk1@mailinator.com',
    'barpreprodsrfeeclerk@mailinator.com', 'barpreprod@mailinator.com', 'SiteSwitchFee@mailnesia.com', 'SiteSwitchSrFee@mailnesia.com',
    'SiteSwitchDM@mailnesia.com', 'SiteSwitchPost@mailnesia.com'],
    Y610: ['site2feeclerk@mailinator.com', 'SiteSwitchFee@mailnesia.com', 'SiteSwitchSrFee@mailnesia.com', 'SiteSwitchDM@mailnesia.com',
           'SiteSwitchPost@mailnesia.com']
  };

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.users.push(
      new UserModel({
        id: 365750,
        courtId: 'BR01',
        sub: 'post.clerk@hmcts.net',
        given_name: 'Chris',
        family_name: 'Spencer',
        password: 'password',
        roles: ['bar-post-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365751,
        courtId: 'BR02',
        sub: 'fee.clerk@hmcts.net',
        given_name: 'Karen',
        family_name: 'Taylor',
        password: 'password',
        roles: ['bar-fee-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365752,
        courtId: 'BR03',
        sub: 'seniorfee.clerk@hmcts.net',
        given_name: 'James',
        family_name: 'Black',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365753,
        courtId: 'BR04',
        sub: 'delivery.manager@hmcts.net',
        given_name: 'Dee',
        family_name: 'Aliu',
        password: 'password',
        roles: ['bar-delivery-manager']
      })
    );

    this.users.push(
      new UserModel({
        id: 365756,
        courtId: 'BR03',
        sub: 'seniorfee.clerk2@hmcts.net',
        given_name: 'James2',
        family_name: 'Black2',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365757,
        courtId: 'BR03',
        sub: 'barpreprodpostclerk@mailinator.com',
        given_name: 'Anjani',
        family_name: 'PostClerk',
        password: 'password',
        roles: ['bar-post-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365758,
        courtId: 'BR02',
        sub: 'barpreprodfeeclerk1@mailinator.com',
        given_name: 'Anis',
        family_name: 'feeclerk',
        password: 'password',
        roles: ['bar-fee-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365759,
        courtId: 'BR03',
        sub: 'barpreprodsrfeeclerk@mailinator.com',
        given_name: 'krishna',
        family_name: 'Srfeeclerk',
        password: 'password',
        roles: ['bar-senior-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365760,
        courtId: 'BR04',
        sub: 'barpreprod@mailinator.com',
        given_name: 'PreProd',
        family_name: 'Admin',
        password: 'password',
        roles: ['bar-delivery-manager']
      })
    );

    this.users.push(
      new UserModel({
        id: 365761,
        courtId: 'BR02',
        sub: 'site2feeclerk@mailinator.com',
        given_name: 'Karen',
        family_name: 'From Milton',
        password: 'password',
        roles: ['bar-fee-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 365762,
        courtId: 'BR02',
        sub: 'SiteSwitchDM@mailnesia.com',
        given_name: 'Multisite',
        family_name: 'DM',
        password: 'password',
        roles: ['bar-delivery-manager'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375763,
        courtId: 'BR02',
        sub: 'SiteSwitchFee@mailnesia.com',
        given_name: 'Multisite',
        family_name: 'Fee Clerk',
        password: 'password',
        roles: ['bar-fee-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375764,
        courtId: 'BR02',
        sub: 'SiteSwitchSrFee@mailnesia.com',
        given_name: 'Multisite',
        family_name: 'Senior Clerk',
        password: 'password',
        roles: ['bar-senior-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375765,
        courtId: 'BR02',
        sub: 'SiteSwitchPost@mailnesia.com',
        given_name: 'Multisite',
        family_name: 'Post Clerk',
        password: 'password',
        roles: ['bar-post-clerk'],
      })
    );

    this.model = new LoginFormModel(this.users[0]);
  }

  onSubmit(e) {
    console.log('userModel', this.model);
    e.preventDefault();
    this.findUser(this.model.email);
    const authenticate = this._userService.authenticate(this.model.getUser(), this.findSiteId(this.model.email));
    this.onAuthenticated.emit(authenticate);
  }

  findUser(email: string) {
    console.log('find user email', email);
    const userModel: UserModel | undefined = this.users.find(user => user.sub === email);
    if (userModel) {
      this.model = new LoginFormModel(userModel);
    }
  }

  findSiteId(email: string): string[] {
    console.log('findSiteId', email);
    return Object.keys(this.userSite).reduce((siteId, key) => {
      if (this.userSite[key].includes(email)) {
        console.log('findSiteId inside if',  `${siteId},${key}`);
        return siteId ? `${siteId},${key}` : key;
      } else {
        console.log('findSiteId inside else',  siteId);
        return siteId;
      }
    }, '').split(',');
  }

  selectUser(userModel: UserModel) {
    this.model = new LoginFormModel(userModel);
  }
}
