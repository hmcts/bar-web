import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formStatus: Boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    return this.handleLoginStatus(true);
  }

  handleLoginStatus($status) {
    const user = this.userService.getUser();
    if (!user) {
      return;
    }
    if ($status === true && user.type === 'postclerk') {
      return this.router.navigateByUrl('/dashboard');
    } else if ($status === true && user.type === 'feeclerk') {
      return this.router.navigateByUrl('/feelog');
    } else if ($status === true && user.type === 'seniorfeeclerk') {
      return this.router.navigateByUrl('/payment-overview');
    } else if ($status === true && user.type === 'deliverymanager') {
      return this.router.navigateByUrl('/payment-overview');
    }
  }

}
