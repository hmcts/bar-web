import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginFormModel } from './login-form.model';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @Output() onAuthenticated: EventEmitter<boolean> = new EventEmitter;
  model: LoginFormModel = new LoginFormModel({ email: 'chris.spencer@hmcts.net', passw: 'password' }) ;

  constructor(private _userService: UserService) {}

  ngOnInit() {}

  onSubmit($ev) {
    $ev.preventDefault();
    const authenticate = this._userService.authenticate(this.model);
    this.onAuthenticated.emit(authenticate);
  }

}
