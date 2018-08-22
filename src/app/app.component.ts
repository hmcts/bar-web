import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTrackerService } from './shared/services/navigationtracker/navigation-tracker.service';
import { PaymentstateService } from './shared/services/state/paymentstate.service';

import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/do';
import { UserService } from './shared/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  // project phase type
  type = 'alpha';
  isLoggedIn = false;

  constructor (
    private router: Router,
    private navigationTrackerService: NavigationTrackerService,
    private paymentState: PaymentstateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.isLoggedIn = (this.userService.getUser() !== null);

    this.router.events
      .pluck('url')
      .subscribe((url: string) => {
        if (url.includes('/feelog/edit/')) {
          this.navigationTrackerService.setNavigationColor('white');
          this.navigationTrackerService.isSearchVisible = false;
        } else {
          // reset opened tab
          this.paymentState.setCurrentOpenedFeeTab(1);
          this.navigationTrackerService.setNavigationColor('blue');
          this.paymentState.setCurrentOpenedFeeTab(1);
          this.navigationTrackerService.isSearchVisible = true;
        }
    });
  }

}
