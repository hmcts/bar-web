import {Component, OnInit} from '@angular/core';
import {NavigationModel} from './navigation.model';
import {PaymentslogService} from '../../../core/services/paymentslog/paymentslog.service';
import {Router} from '@angular/router';
import {SearchService} from '../../../core/services/search/search.service';
import {PaymentStateService} from '../../../shared/services/state/paymentstate.service';
import {SearchModel} from '../../../core/models/search.model';
import {NavigationTrackerService} from '../../../shared/services/navigationtracker/navigation-tracker.service';
import {UserService} from '../../../shared/services/user/user.service';
import {IPaymentType, IResponse} from '../../../core/interfaces';
import {PaymentStatus} from '../../../core/models/paymentstatus.model';
import {PaymentAction} from '../../../core/models/paymentaction.model';
import {PaymentInstructionsService} from '../../../core/services/payment-instructions/payment-instructions.service';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {SitesService} from '../../services/sites/sites.service';
import {SitesModel} from '../../../core/models/sites.model';
import {HostBasedGuardService} from '../../services/auth/host-based-guard.service';
import { environment } from '../../../../environments/environment';


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
    PaymentStatus.DRAFT,
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
  currentSite$: Observable<SitesModel>;
  switchingSiteModalOn = false;

  constructor(
    private userService: UserService,
    private sitesService: SitesService,
    private navigationTrackerService: NavigationTrackerService,
    private _paymentInstructionService: PaymentInstructionsService,
    private paymentslogService: PaymentslogService,
    private router: Router,
    private searchService: SearchService,
    private _paymentState: PaymentStateService,
    private _hostBasedValidator: HostBasedGuardService) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.advancedSearchedOpen = false);
    this.paymentTypes$ = this._paymentState.paymentTypes$;
    this.searchModel.action = '';
    this.searchModel.paymentType = '';
    this.searchModel.status = 'D,P,PA,A,V,TTB,REJ,C';
    this.currentSite$ = this.sitesService.getCurrentSite$();
  }

  isSiteAdminVisible() {
    return this.user.type === 'deliverymanager' && this._hostBasedValidator.isInternalAddress();
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
    return this.sitesService.getSites();
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
      moment(this.searchModel.startDate, 'DDMMYYYY').format('YYYY-MM-DD') :
      undefined;
  }

  setCurrentSite(site: SitesModel) {
    this.sitesService.setCurrentSite(site);
    this.switchingSiteModalOn = true;
    this.reloadPage();
  }

  reloadPage() {
    window.location.href = '/';
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
    if (!environment.production) {
      this.userService.logOut();
    }
    this.navigateToLogout();
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

  navigateToLogout() {
    document.location.href = '/logout';
  }

}
