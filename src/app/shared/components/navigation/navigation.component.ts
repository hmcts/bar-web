import { Component, OnInit } from '@angular/core';
import { NavigationModel } from './navigation.model';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { Router } from '@angular/router';
import { SearchService } from '../../../core/services/search/search.service';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { SearchModel } from '../../../core/models/search.model';
import { NavigationTrackerService } from '../../../shared/services/navigationtracker/navigation-tracker.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IResponse } from '../../../core/interfaces';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { PaymentAction } from '../../../core/models/paymentaction.model';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  providers: [PaymentInstructionsService, PaymentslogService],
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  model: NavigationModel = new NavigationModel();
  searchModel: SearchModel = new SearchModel();
  todaysDate = Date.now();
  name = '';
  advancedSearchedOpen = false;
  allStatuses = [
    PaymentStatus.PENDING,
    PaymentStatus.PENDINGAPPROVAL,
    PaymentStatus.APPROVED,
    PaymentStatus.VALIDATED,
    PaymentStatus.TRANSFERREDTOBAR,
    PaymentStatus.REJECTED
  ];

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService,
    private _paymentInstructionService: PaymentInstructionsService,
    private paymentslogService: PaymentslogService,
    private router: Router,
    private searchService: SearchService,
    private _paymentState: PaymentstateService) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.advancedSearchedOpen = false);

    this.searchModel.action = '';
    this.searchModel.paymentType = '';
    this.searchModel.status = PaymentStatus.PENDING;
  }

  get navigationClass() {
    return this.navigationTrackerService.barColor;
  }

  get isSearchVisible() {
    if (!this.navigationTrackerService.isSearchVisible) {
      this.advancedSearchedOpen = false;
    }
    return this.navigationTrackerService.isSearchVisible;
  }

  get user() {
    return this.userService.getUser();
  }

  get searchResults() {
    return this.searchService.paymentLogs;
  }

  get paymentActions() {
    return Object.keys(PaymentAction).map((key, index) => {
      return PaymentAction[key];
    });
  }

  onSubmit($ev) {
    $ev.preventDefault();

    if ($ev.which && $ev.which === 13) {
      this.performQuerySearch();
    }
  }

  onClick() {
    this.performQuerySearch();
  }

  performQuerySearch() {
    this.paymentslogService
      .searchPaymentsByDate(this.searchModel)
      .then((result: IResponse) => {
        this.searchService
          .createPaymentInstructions(this._paymentInstructionService.transformJsonIntoPaymentInstructionModels(result.data));
        this.searchModel.query = '';
        return this.router.navigateByUrl('/search');
      })
      .catch(err => console.log(err));
  }

  logout() {
    this.userService.logOut();
    document.location.href = '/logout';
  }

  toggleAdvancedSearch() {
    this.advancedSearchedOpen = !this.advancedSearchedOpen;
  }

  performQueryByDate(e) {
    e.preventDefault();
    this.performQuerySearch();
  }

}
