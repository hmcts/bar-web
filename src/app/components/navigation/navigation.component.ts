import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigationtracker/navigation-tracker.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { NavigationModel } from './navigation.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentstateService } from '../../state/paymentstate.service';
import { SearchModel } from '../../models/search.model';

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
    private paymentState: PaymentstateService) {}

  async ngOnInit() {
    this.searchModel.action = 'All';
    this.searchModel.paymentType = 'All';
    this.searchModel.status = 'All';

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

  performQuerySearch() {
    console.log( this.searchModel );
    // this.paymentslogService.searchPayments(this.model.searchString).then(res => {
    //   this.searchService.populatePaymentLogs( res.data );
    //   this.model.searchString = '';
    // });
  }

  logout() {
    this.userService.logOut();
    this.router.navigateByUrl('/');
  }

  openAdvancedSearch() {
    this.advancedSearchedOpen = !this.advancedSearchedOpen;
  }

  async performQueryByDate($event) {
    $event.preventDefault();
    const [err, data] = await UtilService.toAsync(this.paymentslogService.searchPaymentsByDate(this.dateSearchModel));
    if (!err) {
      this.searchService.populatePaymentLogs( data.data );
    }
  }

}
