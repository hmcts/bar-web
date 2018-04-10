import { Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AuthGuard {

  constructor (private authService: AuthService, private router: Router) {
    console.log('AuthGuard instantiated.');
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
    console.log(`Is this user authenticated?: ${this.authService.isAuthenticated()}`);
    if (!this.authService.isAuthenticated()) {
      return this.router.navigate(['/']);
    }

    return true;
  }

}
