import { Component, OnInit, HostListener } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { IPaymentStatistics } from '../../interfaces/payment.statistics';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { Observable } from 'rxjs';
import { IPaymentAction } from '../../interfaces/payment-actions';
import {IResponse} from '../../interfaces';
import {PaymentAction} from '../../models/paymentaction.model';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { SearchModel } from '../../models/search.model';
import { UserService } from '../../../shared/services/user/user.service';
import * as moment from 'moment';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-summary-review',
  templateUrl: './payment-review-summary.component.html',
  styleUrls: ['./payment-review-summary.component.scss'],
  providers: [PaymenttypeService, BarHttpClient, PaymentsOverviewService, PaymentInstructionsService]
})
export class PaymentReviewSummaryComponent implements OnInit {
  paymentActions$: Observable<IPaymentAction[]>;
  fullName: string;
  status: string;
  oldStatus: string;
  userId: string;
  activeAction: IPaymentAction;
  stats = null;
  showStats = true;
  showDetails = false;
  query: string;
  count = {
    sfrejectedItems: 0,
    sfapprovedItems: 0,
    mgapprovedItems: 0,
    mgrejectedItems: 0
  };

  constructor(
    private _paymentOverviewService: PaymentsOverviewService,
    private _paymentStateService: PaymentStateService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _userService: UserService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paymentActions$ = this._paymentStateService.getPaymentActions();
    this.onPopState({
      state: {
        navigationId: 1
      }
    });
    combineLatest(this._route.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.oldStatus = val.qparams.old_status;
          this.fullName = val.qparams.fullName;
          this._paymentOverviewService
            .getPaymentStatsByUserAndStatus(this.userId, this.status, this.oldStatus)
            .subscribe((resp: IResponse) => this.processData(resp));
        }
      });
      this.getPaymentsCounts();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (event.state && event.state.navigationId) {
      const hash = decodeURIComponent(window.location.hash.substr(1)).split('/');
      this._paymentStateService.getPaymentActions().subscribe(actions => {
        const currentAction = actions.find(action => {
          return action.action === hash[0];
        });
        this.activeAction = currentAction ? currentAction : actions[0];
        if (hash.length < 2) {
          this.showStats = true;
          this.showDetails = false;
        } else {
          this.loadDetails({ query: hash[1] });
        }
      });
    }
  }

  makeActionActive(action: IPaymentAction) {
    window.location.hash = action.action;
    this.activeAction = action;
    this.showStats = true;
    this.showDetails = false;
  }

  loadDetails(event) {
    this.query = event.query.substr(event.query.indexOf('?'));
    this.showStats = false;
    this.showDetails = true;
    window.location.hash = `${this.activeAction.action}/${this.query}`;
  }

  reloadStats(event) {
    this._paymentOverviewService
      .getPaymentStatsByUserAndStatus(this.userId, this.status, this.oldStatus)
      .subscribe((resp: IResponse) => this.processData(resp));
      this.getPaymentsCounts();
  }

  private processData(resp: IResponse) {
    this.stats = resp.data.content;
  }

  getPaymentsCounts(): void {
    const searchModel: SearchModel = new SearchModel();
    searchModel.userId = this._userService.getUser().id.toString();
    searchModel.startDate = moment().format();
    searchModel.endDate = moment().format();
    searchModel.status = PaymentStatus.TRANSFERREDTOBAR;
    const mgapprovedItems = this._paymentsInstructionService.getCount(searchModel);
    searchModel.status = PaymentStatus.COMPLETED;
    const mgcompletedItems = this._paymentsInstructionService.getCount(searchModel);
    searchModel.status = PaymentStatus.REJECTEDBYDM;
    const rejectedItems = this._paymentsInstructionService.getCount(searchModel);
    searchModel.status = PaymentStatus.REJECTED;
    const sfrejectedItems = this._paymentsInstructionService.getCount(searchModel);
    searchModel.status = PaymentStatus.APPROVED;
    const sfapprovedItems = this._paymentsInstructionService.getCount(searchModel);


    forkJoin([mgapprovedItems, mgcompletedItems, rejectedItems, sfrejectedItems, sfapprovedItems])
    .subscribe({
      next: (result: IResponse[]) => {
        const [mgapprovedcount, mgcompletedcount, mgrejectedcount, srrejectedcount, srapprovedcount] = result;
        this.count.mgapprovedItems = mgapprovedcount.data + mgcompletedcount.data;
        this.count.mgrejectedItems = mgrejectedcount.data;
        this.count.sfrejectedItems = srrejectedcount.data;
        this.count.sfapprovedItems = srapprovedcount.data;
      }
    });
}
}
