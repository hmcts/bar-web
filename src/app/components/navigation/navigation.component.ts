import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigationtracker/navigation-tracker.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { NavigationModel } from './navigation.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  model: NavigationModel = new NavigationModel();
  todaysDate = Date.now();

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService,
    private paymentslogService: PaymentslogService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService) { }

  ngOnInit() {
  }

  get navigationClass() {
    return this.navigationTrackerService.barColor;
  }

  get user() {
    return this.userService.getUser();
  }

  onSubmit($ev) {
    $ev.preventDefault();
    const response = this.paymentslogService.searchPayments(this.model.searchString);
    response.then(res => this.searchService.populatePaymentLogs( res.data ));
  }

  get searchResults() {
    return this.searchService.paymentLogs;
  }

}
