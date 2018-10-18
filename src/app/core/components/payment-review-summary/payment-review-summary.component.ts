import { Component, OnInit } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IPaymentStatistics } from '../../interfaces/payment.statistics';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

@Component({
  selector: 'app-payment-summary-review',
  templateUrl: './payment-review-summary.component.html',
  styleUrls: ['./payment-review-summary.component.scss'],
  providers: [PaymenttypeService, BarHttpClient, PaymentsOverviewService]
})
export class PaymentReviewSummaryComponent implements OnInit {
  userId: string;
  status: string;
  fullName: string;
  numOfPaymentInstructions = 0;

  constructor(
    private paymentOverviewService: PaymentsOverviewService,
    private paymenttypeService: PaymenttypeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.fullName = val.qparams.fullName;
          this.paymentOverviewService
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
}
