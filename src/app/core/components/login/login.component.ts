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

  async ngOnInit() {
    if (this.userService.getUser()) {
      this.router.navigateByUrl('/dashboard');
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
