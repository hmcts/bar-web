import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private _auth: AuthService, private _router: Router, private _userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: Array<string> = route.data.expectedRoles;

    if (!this._auth.isAuthenticated()) {
      this._router.navigate(['login']);
      return false;
    }
    const user = this._userService.getUser();
    const matchingRole = expectedRoles.some(role => user.roles.some(uRole => role === uRole));

    if (matchingRole) {
      return true;
    }
    this._router.navigate(['error', 403]);
    return false;
  }
}
