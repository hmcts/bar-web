import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationTrackerService} from './services/navigationtracker/navigation-tracker.service';

import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/do';
import { PaymentstateService } from './state/paymentstate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // project phase type
  type = 'alpha';

  constructor (
    private router: Router,
    private navigationTrackerService: NavigationTrackerService,
    private paymentState: PaymentstateService
  ) { }

  ngOnInit() {
    this.router.events
      .pluck('url')
      .subscribe((url: string) => {
        if (url.includes('/feelog/edit/')) {
          this.navigationTrackerService.setNavigationColor( 'white' );
        } else {
          this.navigationTrackerService.setNavigationColor( 'blue' );
          this.paymentState.setCurrentOpenedFeeTab(1);
        }
      });
  }

}
