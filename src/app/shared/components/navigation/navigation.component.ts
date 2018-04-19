import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
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

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  model: NavigationModel = new NavigationModel();
  searchModel: SearchModel = new SearchModel();
  todaysDate = Date.now();
  name = '';
  advancedSearchedOpen = false;
  dateSearchModel = new SearchModel();

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService,
    private paymentslogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private paymentState: PaymentstateService,
    private location: Location) {}

  async ngOnInit() {
    this.searchModel.action = 'All';
    this.searchModel.paymentType = 'All';
    this.searchModel.status = 'D';

    const [err, data] = await UtilService.toAsync(this.paymentTypeService.getPaymentTypes());
    if (!err) {
      this.paymentState.setSharedPaymentTypes(data.data);
    }
  }

  get navigationClass() {
    return this.navigationTrackerService.barColor;
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

  async performQuerySearch() {
    const [err, result] = await UtilService.toAsync(this.paymentslogService.searchPaymentsByDate(this.searchModel));
    if (!err) {
      this.searchService.populatePaymentLogs( result.data );
    }

    this.searchModel.caseReference = '';
  }

  logout() {
    this.userService.logOut();
    window.location.href = '/logout';
  }

  openAdvancedSearch() {
    this.advancedSearchedOpen = !this.advancedSearchedOpen;
  }

  async performQueryByDate($event) {
    $event.preventDefault();
    const [err, result] = await UtilService.toAsync(this.paymentslogService.searchPaymentsByDate(this.searchModel));
    if (!err) {
      this.searchService.populatePaymentLogs( result.data );
    }
  }

}
