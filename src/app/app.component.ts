import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NavigationTrackerService } from './shared/services/navigationtracker/navigation-tracker.service';
import { PaymentStateService } from './shared/services/state/paymentstate.service';

import { UserService } from './shared/services/user/user.service';
import { pluck, map, filter } from 'rxjs/operators';
import { isUndefined, isNull } from 'lodash';
import { MonitoringService } from './shared/services/appinsights/monitoring.service';
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
    private monitoringService: MonitoringService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const navEndEvents = router.events.pipe (
      filter(event => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-146285829-1', {'page_path': event.urlAfterRedirects} );
    });
    }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => console.log(`URL is: ${url}`));
    this.isLoggedIn = !isNull(this.userService.getUser());
    this.monitoringService.logEvent('application initialized');
    this.document.documentElement.lang = 'en';
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
