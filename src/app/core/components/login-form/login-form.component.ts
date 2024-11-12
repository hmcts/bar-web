import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginFormModel } from './login-form.model';
import { UserService } from '../../../shared/services/user/user.service';
import { UserModel } from '../../models/user.model';
import * as CryptoJS from 'crypto-js';

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

  private static secretKey = LoginFormComponent.generatePassword(12, true, true, true);

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.users.push(
      new UserModel({
        id: 365750,
        courtId: 'BR01',
        email: 'post.clerk@hmcts.net',
        forename: 'Chris',
        surname: 'Spencer',
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-post-clerk']
      })
    );

    this.users.push(
      new UserModel({
        id: 365758,
        courtId: 'BR02',
        email: 'barpreprodfeeclerk1@mailinator.com',
        forename: 'Anis',
        surname: 'feeclerk',
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
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
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-delivery-manager']
      })
    );

    this.users.push(
      new UserModel({
        id: 365761,
        courtId: 'BR02',
        email: 'site2feeclerk@mailinator.com',
        forename: 'Karen',
        surname: 'From Milton',
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-fee-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 365762,
        courtId: 'BR02',
        email: 'SiteSwitchDM@mailnesia.com',
        forename: 'Multisite',
        surname: 'DM',
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-delivery-manager'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375763,
        courtId: 'BR02',
        email: 'SiteSwitchFee@mailnesia.com',
        forename: 'Multisite',
        surname: 'Fee Clerk',
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-fee-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375764,
        courtId: 'BR02',
        email: 'SiteSwitchSrFee@mailnesia.com',
        forename: 'Multisite',
        surname: 'Senior Clerk',
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-senior-clerk'],
      })
    );

    this.users.push(
      new UserModel({
        id: 375765,
        courtId: 'BR02',
        email: 'SiteSwitchPost@mailnesia.com',
        forename: 'Multisite',
        surname: 'Post Clerk',
        password: LoginFormComponent.generatePassword(12, true, true, true),
        roles: ['bar-post-clerk'],
      })
    );

    this.model = new LoginFormModel(this.users[0]);
  }

  onSubmit(e) {
    e.preventDefault();
    this.findUser(this.model.email);
    const authenticate = this._userService.authenticate(this.model.getUser(), this.findSiteId(this.model.email));
    this.onAuthenticated.emit(authenticate);
  }



  findUser(email: string) {
    const userModel: UserModel | undefined = this.users.find(user => user.email === email);
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

  // Function to generate a password
  static  generatePassword(length: number = 12, includeUppercase: boolean = true, includeNumbers: boolean = true, includeSpecialChars: boolean = true): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';

    let characterPool = lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSpecialChars) characterPool += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }

    return LoginFormComponent.encrypt(password);
  }


  // Encrypts a string
  static encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, LoginFormComponent.secretKey).toString();
    return encrypted;
  }

  // Decrypts a string
  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, LoginFormComponent.secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
