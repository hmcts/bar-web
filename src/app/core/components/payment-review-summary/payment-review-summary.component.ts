import { Component, OnInit } from '@angular/core';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { IPaymentStatistics } from '../../interfaces/payment.statistics';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { IResponse, IPaymentType } from '../../interfaces';
import { first } from 'lodash';
import { PaymentTypeEnum } from '../../models/payment.type.enum';

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
  stats = [];
  numOfPaymentInstructions = 0;
  sumValueOfPaymentInstructions = 0;
  cardStyle = { 'width.px': 223, 'max-width.px': 223 };
  paymentTypes: IPaymentType[];
  paymentTypeEnum = new PaymentTypeEnum();

  constructor(
    private paymentOverviewService: PaymentsOverviewService,
    private paymenttypeService: PaymenttypeService,
    private router: Router,
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
    this.stats = [];

    this.paymenttypeService.getPaymentTypes()
      .then(paymentTypes => {
        Object.keys(resp.data.content).forEach(key => {
          // Create a new merged group (cheque & postal order)
          const merged = this.createMergedGroup();

          // We are going to interate through a bgc group
          resp.data.content[key].forEach(element => {
            const stat = <IPaymentStatistics>element;
            if (stat.bgc === null) {
              stat.bgc = '';
            }
            const paymentType = paymentTypes.data.find(type => type.id === stat.payment_type);
            stat.payment_type_name = paymentType ? paymentType.name : element.payment_type;
            this.numOfPaymentInstructions += stat.count;
            this.sumValueOfPaymentInstructions += stat.total_amount;
            if (stat.payment_type === this.paymentTypeEnum.CHEQUE || stat.payment_type === this.paymentTypeEnum.POSTAL_ORDER) {
              this.appendToMerged(merged, stat);
            } else {
              this.stats.push(stat);
            }
          });

          if (merged.count > 0) {
            this.stats.push(merged);
          }
        });
        this.stats.reverse();
        if (this.stats.length > 0) {
          this.fullName = first(this.stats).name;
        }
      })
      .catch(console.log);
  }

  private createMergedGroup(): IPaymentStatistics {
    return {
      bgc: '',
      status: '',
      user_id: '',
      _links: [],
      count: 0,
      name: '',
      payment_type: 'cheques',
      payment_type_name: 'Cheque & Postal order',
      total_amount: 0
    };
  }

  private appendToMerged(merged: IPaymentStatistics, toBeMerged: IPaymentStatistics) {
    merged.count += toBeMerged.count;
    merged.total_amount += toBeMerged.total_amount;
    merged._links = toBeMerged._links;
    merged.bgc = toBeMerged.bgc;
    merged.status = toBeMerged.status;
    merged.user_id = toBeMerged.user_id;
    merged.name = toBeMerged.name;
  }

  cardClicked(links) {
    const link = links['stat-group-details']
      ? links['stat-group-details'].href
      : links['stat-details'].href;
    const url = new URL(link);
    console.log('url to send', url.pathname + url.search);
    this.router.navigateByUrl(url.pathname + url.search);
  }
}
