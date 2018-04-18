import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

  constructor(private _userService: UserService) {}

  public isAuthenticated(): boolean {
    const user = this._userService.getUser();
    return !!user;
  }

}

