import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavigationTrackerService } from './shared/services/navigationtracker/navigation-tracker.service';
import { PaymentStateService } from './shared/services/state/paymentstate.service';

import { UserService } from './shared/services/user/user.service';
import { pluck, map } from 'rxjs/operators';
import { isUndefined, isNull } from 'lodash';
import { MonitoringService } from './shared/services/appinsights/monitoring.service';
import { filter } from 'rxjs/operators';
declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  isLoggedIn = false;
  type = 'alpha';
  
  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navigationTrackerService: NavigationTrackerService,
    private paymentState: PaymentStateService,
    private userService: UserService,
    private monitoringService: MonitoringService
  ) {
    const navEndEvents = router.events.pipe(
      filter(event =>event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event:NavigationEnd) => {
      gtag('config', 'UA-146285829-1');
    })
   }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => console.log(`URL is: ${url}`));
    this.isLoggedIn = !isNull(this.userService.getUser());
    this.monitoringService.logEvent('application initialized');
    // this.router.events
    //   .pipe(map(({ url }) => url))
    //   .subscribe((url: string) => {
    //     if (!isUndefined(url) && url.includes('/feelog/edit/')) {
    //       this.navigationTrackerService.setNavigationColor('white');
    //       this.navigationTrackerService.isSearchVisible = false;
    //     } else {
    //       this.paymentState.setCurrentOpenedFeeTab(1);
    //       this.navigationTrackerService.setNavigationColor('blue');
    //       this.paymentState.setCurrentOpenedFeeTab(1);
    //       this.navigationTrackerService.isSearchVisible = true;
    //     }
    //   });
  }

}
