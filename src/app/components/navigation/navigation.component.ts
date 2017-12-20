import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigationtracker/navigation-tracker.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  todaysDate = Date.now();

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService) { }

  ngOnInit() {
  }

  get navigationClass() {
    return this.navigationTrackerService.barColor;
  }

  get user() {
    return this.userService.getUser();
  }

}
