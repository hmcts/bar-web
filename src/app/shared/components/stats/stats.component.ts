import { OnInit, Component } from '@angular/core';
import { IPaymentStatistics } from '../../../core/interfaces/payment.statistics';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentsOverviewService } from '../../../core/services/paymentoverview/paymentsoverview.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { isNull } from 'lodash';
import { PaymentType } from '../../models/util/model.utils';

@Component({
  selector: 'app-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {
  userId: string;
  status: string;
  fullName: string;
  stats: Array<IPaymentStatistics> = [];
  numOfPaymentInstructions = 0;
  sumValueOfPaymentInstructions = 0;
  cardStyle: any = { 'width.px': 223, 'max-width.px': 223 };

  constructor(private paymentOverviewService: PaymentsOverviewService,
    private paymenttypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.fullName = val.qparams.fullName;
          this.paymentOverviewService
            .getPaymentStatsByUserAndStatus(this.userId, this.status)
            .subscribe(resp => {
              this.processData(resp);
            });
      }
    });
  }

  private processData(resp) {
    return this.paymenttypeService.getPaymentTypes()
      .then(pts => {
        Object.keys(resp.data.content).forEach(key => {
          // Create a new merged group (cheque & postal order)
          const merged = this.createMergedGroup();

          // We are going to interate through a bgc group
          resp.data.content[key].forEach(element => {
            const stat = <IPaymentStatistics> element;
            const pt = pts.data.find(type => type.id === stat.payment_type);
            stat.payment_type_name = pt ? pt.name : element.payment_type;
            this.numOfPaymentInstructions += stat.count;
            this.sumValueOfPaymentInstructions += stat.total_amount;

            if (stat.payment_type === PaymentType.CHEQUE || stat.payment_type === PaymentType.POSTAL_ORDER) {
              this.appendToMerged(merged, stat);
            } else {
              this.stats.push(stat);
            }
          });

          if (merged.count > 0) {
            this.stats.unshift(merged);
          }
        });
    });
  }

  private createMergedGroup(): IPaymentStatistics {
    return {
      bgc: '',
      status: '',
      user_id: '',
      _links: [],
      count: 0,
      payment_type: 'merged',
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
  }

  cardClicked(card) {
    console.log(card);
    const paymentType = card.payment_type === 'merged' ? 'CHEQUE,POSTAL_ORDER' : card.payment_type.toUpperCase();
    const bgcNumber = isNull(card.bgc) ? '' : `&bgcNumber=${card.bgc}`;
    const url = `/users/${this.userId}/stats/details?status=${this.status}&paymentType=${paymentType}&fullName=${this.fullName}${bgcNumber}`;

    console.log(url);
    // console.log(JSON.stringify(links));
    // const link = links['stat-group-details'] ? links['stat-group-details'].href : links['stat-details'].href;
    // console.log(link);
    // console.log('Working.');
    // const url = new URL(link);
    // console.log('Working still...');
    // return this.router.navigateByUrl(`/users//stats/details${url.search}&fullName=${this.fullName}`);
  }

  getBgcNumber(card: IPaymentStatistics) {
    return !isNull(card.bgc)
      ? `BGC Number.: ${card.bgc}`
      : '';
  }
}
