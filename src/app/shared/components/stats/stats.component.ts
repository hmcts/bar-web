import { OnInit, Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { IPaymentStatistics } from '../../../core/interfaces/payment.statistics';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentsOverviewService } from '../../../core/services/paymentoverview/paymentsoverview.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { isNull } from 'lodash';
import { PaymentType } from '../../models/util/model.utils';
import { IPaymentType } from '../../../core/interfaces/payments-log';
import { combineLatest } from 'rxjs';
import { IPaymentAction } from '../../../core/interfaces/payment-actions';

@Component({
  selector: 'app-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, OnChanges {
  @Input() action: IPaymentAction;
  @Input() content = [];
  @Output() onCardClicked = new EventEmitter<any>();
  userId: string;
  status: string;
  fullName: string;
  stats: IPaymentStatistics[] = [];
  numOfPaymentInstructions = 0;
  sumValueOfPaymentInstructions = 0;
  cardStyle: any = { 'width.px': 223, 'max-width.px': 223 };
  paymentTypes: IPaymentType[];

  constructor(private paymentOverviewService: PaymentsOverviewService,
    private paymenttypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    combineLatest(this.route.params,
                  this.route.queryParams,
                  this.paymenttypeService.getPaymentTypes(), (params, qparams, pTypes) => ({ params, qparams, pTypes }))
      .subscribe(val => {
        this.userId = val.params.id;
        this.status = val.qparams.status;
        this.fullName = val.qparams.fullName;
        this.paymentTypes = val.pTypes;
        this.processData(this.content, this.paymentTypes);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['action'] && this.paymentTypes) {
      this.processData(this.content, this.paymentTypes);
    }
}

  private processData(content, pts) {
    this.stats = [];
    this.numOfPaymentInstructions = 0;
    this.sumValueOfPaymentInstructions = 0;
    Object.keys(content).forEach(key => {
      // Create a new merged group (cheque & postal order)
      const merged = this.createMergedGroup();

      // We are going to interate through a bgc group
      content[key].forEach(element => {
        if (element.action !== this.action.action) {
          return;
        }
        const stat = <IPaymentStatistics> element;
        const pt = pts.find(type => type.id === stat.payment_type);
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

  cardClicked(links) {
    const link = links['stat-group-details'] ? links['stat-group-details'].href : links['stat-details'].href;
    this.onCardClicked.emit({ query: link, fullName: this.fullName });
  }

  getBgcNumber(card: IPaymentStatistics) {
    return !isNull(card.bgc)
      ? `BGC Number.: ${card.bgc}`
      : '';
  }

  getBgcNumberFromString(bgcString: string) {
    const stringToBeReplaced = 'BGC Number.: ';
    const newString = 'BGC';
    return bgcString.replace(stringToBeReplaced, newString);
  }

  getUrlParams(search) {
      const hashes = search.slice(search.indexOf('?') + 1).split('&');
      const params = {};
      hashes.map(hash => {
          const [key, val] = hash.split('=');
          params[key] = decodeURIComponent(val);
      });

      return params;
  }
}
