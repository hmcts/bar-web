import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  todaysDate = Date.now();

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  get user() {
    return this._userService.getUser();
  }

  doSomething() {

  }

}
