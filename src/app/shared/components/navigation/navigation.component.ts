import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationModel } from './navigation.model';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SearchService } from '../../../core/services/search/search.service';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { SearchModel } from '../../../core/models/search.model';
import { UtilService } from '../../../shared/services/util/util.service';
import { NavigationTrackerService } from '../../../shared/services/navigationtracker/navigation-tracker.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IResponse } from '../../../core/interfaces';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  model: NavigationModel = new NavigationModel();
  searchModel: SearchModel = new SearchModel();
  todaysDate = Date.now();
  name = '';
  advancedSearchedOpen = false;
  allStatuses = ['P', 'PA', 'A', 'V', 'TTB', 'REJ'];

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService,
    private paymentslogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private paymentState: PaymentstateService) {}

  async ngOnInit() {
    this.searchModel.action = '';
    this.searchModel.paymentType = '';
    this.searchModel.status = PaymentStatus.PENDING;
    this.paymentTypeService.getPaymentTypes().then((data: IResponse) => data.data);
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

  get paymentTypes() {
    return this.paymentState.state.paymentTypes;
  }

  get searchResults() {
    return this.searchService.paymentLogs;
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
        this.searchService.populatePaymentLogs( result.data );
        this.searchModel.caseReference = '';
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
