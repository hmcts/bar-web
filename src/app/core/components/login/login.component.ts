import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  static USER_COOKIE = '__user-info';

  formStatus: Boolean = false;
  user: any;

  constructor(private _cookieService: CookieService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    const userCookie = this._cookieService.get(LoginComponent.USER_COOKIE);
    if (!userCookie) {
      return;
    }
    this.user = JSON.parse(userCookie);
    if (this.user.roles.includes('bar-post-clerk')) {
      return this.router.navigateByUrl('/dashboard');
    } else if (this.user.roles.includes('bar-fee-clerk')) {
      return this.router.navigateByUrl('/feelog');
    } else if (this.user.roles.includes('bar-senior-clerk')) {
      return this.router.navigateByUrl('/payment-overview');
    } else if (this.user.roles.includes('bar-delivery-manager')) {
      return this.router.navigateByUrl('/payment-overview');
    }
  }

  handleLoginStatus($status) {
    if ($status === true && this.userService.getUser().type === 'postclerk') {
      return this.router.navigateByUrl('/dashboard');
    } else if ($status === true && this.userService.getUser().type === 'feeclerk') {
      return this.router.navigateByUrl('/feelog');
    } else if ($status === true && this.userService.getUser().type === 'seniorfeeclerk') {
      return this.router.navigateByUrl('/payment-overview');
    } else if ($status === true && this.userService.getUser().type === 'deliverymanager') {
      return this.router.navigateByUrl('/payment-overview');
    }
  }

}
