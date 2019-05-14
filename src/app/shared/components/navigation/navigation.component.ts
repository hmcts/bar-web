import { Component, OnInit } from '@angular/core';
import { NavigationModel } from './navigation.model';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { Router } from '@angular/router';
import { SearchService } from '../../../core/services/search/search.service';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { SearchModel } from '../../../core/models/search.model';
import { NavigationTrackerService } from '../../../shared/services/navigationtracker/navigation-tracker.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IResponse, IPaymentType } from '../../../core/interfaces';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { PaymentAction } from '../../../core/models/paymentaction.model';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { SitesService } from '../../services/sites/sites.service';
import { SitesModel } from '../../../core/models/sites.model';


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
    PaymentStatus.REJECTED,
    PaymentStatus.COMPLETED
  ];
  paymentTypes$: Observable<IPaymentType[]>;
  dateFromMax = moment().format('YYYY-MM-DD');

  constructor(
    private userService: UserService,
    private sitesService: SitesService,
    private navigationTrackerService: NavigationTrackerService,
    private _paymentInstructionService: PaymentInstructionsService,
    private paymentslogService: PaymentslogService,
    private router: Router,
    private searchService: SearchService,
    private _paymentState: PaymentStateService) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.advancedSearchedOpen = false);
    this.paymentTypes$ = this._paymentState.paymentTypes$;
    this.searchModel.action = '';
    this.searchModel.paymentType = '';
    this.searchModel.status = 'P,PA,A,V,TTB,REJ,C';
  }

  get endDate(): string {
    return this.formatBackDate(this.searchModel.endDate);
  }

  set endDate(date: string) {
    this.searchModel.endDate = this.formatDate(date);
  }

  get startDate(): string {
    return this.formatBackDate(this.searchModel.startDate);
  }

  set startDate(date: string) {
    this.endDate = '';
    this.searchModel.startDate = this.formatDate(date);
  }

  get sites$(): Observable<SitesModel[]> {
    if (this.user && this.user.email) {
      return this.sitesService.getSites();
    }
    return null;
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

  get endDateMin() {
    return this.searchModel.startDate ?
      moment(this.searchModel.startDate, 'DDMMYYYY').add(1, 'days').format('YYYY-MM-DD') :
      undefined;
  }

  get currentSite$(): Observable<SitesModel> {
    return this.sitesService.getCurrentSite$();
  }

  setCurrentSite(site: SitesModel) {
    this.sitesService.setCurrentSite(site);
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
        const { data } = result;
        const paymentInstructions = this._paymentInstructionService.transformJsonIntoPaymentInstructionModels(data);
        this.searchService.createPaymentInstructions(paymentInstructions);
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

  formatDate(date: string): string {
    return date ? moment(date).format('DDMMYYYY') : date;
  }

  formatBackDate(date: string): string {
    return date ? moment(date, 'DDMMYYYY').format('YYYY-MM-DD') : date;
  }

}
