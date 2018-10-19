import { Component, OnInit } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IPaymentStatistics } from '../../interfaces/payment.statistics';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { Observable } from 'rxjs';
import { IPaymentAction } from '../../interfaces/payment-actions';

@Component({
  selector: 'app-payment-summary-review',
  templateUrl: './payment-review-summary.component.html',
  styleUrls: ['./payment-review-summary.component.scss'],
  providers: [PaymenttypeService, BarHttpClient, PaymentsOverviewService]
})
export class PaymentReviewSummaryComponent implements OnInit {
  paymentActions$: Observable<IPaymentAction[]>;
  fullName: string;
  status: string;
  userId: string;
  numOfPaymentInstructions = 0;

  constructor(
    private _paymentOverviewService: PaymentsOverviewService,
    private _paymentStateService: PaymentStateService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paymentActions$ = this._paymentStateService.paymentActions$;

    combineLatest(this._route.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.fullName = val.qparams.fullName;
          this._paymentOverviewService
            .getPaymentStatsByUserAndStatus(this.userId, this.status)
            .subscribe(resp => this.processData(resp));
        }
      });
  }

  private processData(resp) {
    this.numOfPaymentInstructions = 0;
    Object.keys(resp.data.content).forEach(key => resp.data.content[key].forEach(element => {
      const stat = <IPaymentStatistics> element;
      this.numOfPaymentInstructions += stat.count;
    }));
  }

  getPaymentActionCount(paymentAction: IPaymentAction) {
    console.log( paymentAction );
  }
}
