import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

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

  handleLoginStatus($status): void {
    if ($status === true && this.userService.getUser().type === 'postclerk') {
      this.router.navigateByUrl('/dashboard');
    } else if ($status === true && this.userService.getUser().type === 'feeclerk') {
      this.router.navigateByUrl('/feelog');
    } else if ($status === true && this.userService.getUser().type === 'seniorfeeclerk') {
      this.router.navigateByUrl('/payment-overview');
    }
  }

}
