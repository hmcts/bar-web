import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-feelog',
  templateUrl: './feelog.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./feelog.component.css']
})
export class FeelogComponent implements OnInit {
  payments_logs: IPaymentsLog[] = [];

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private router: Router,
    private searchService: SearchService) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }
    this.getPaymentLogs();
  }

  /* @TODO: when form is being submitted, do what is necessary */
  onFormSubmission(): void {}

  private async getPaymentLogs() {
    this.payments_logs = [];
    try {
      const paymentslog: any = await this.paymentsLogService.getPaymentsLog(PaymentStatus.pending);
      for (let i = 0; i < paymentslog.data.length; i++) {
        paymentslog.data[i].selected = false;
        paymentslog.data[i].payment_reference_id = this.getReferenceId(paymentslog.data[i]);
        this.payments_logs.push(paymentslog.data[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private getReferenceId ( data: IPaymentsLog ) {
    let refId = '-';
    if (data.payment_type) {
      switch (data.payment_type.id) {
        case 'cheques':
          refId = data.cheque_number;
          break;
        case 'postal-orders':
          refId = data.postal_order_number;
          break;
        case 'allpay':
          refId = data.all_pay_transaction_id;
          break;
        default:
          refId = '-';
      }
    }
    return refId;
  }

  get searchResults() {
    // Check if there is a search opertion performed
    if (this.searchService.isSearchOperationPerformed === true) {
      this.payments_logs = [];
      this.searchService.isSearchOperationPerformed = false; // Reset the boolean to false for future requests
    }
    if (this.searchService.paymentLogs && this.searchService.paymentLogs.length > 0) {
      for (let i = 0; i < this.searchService.paymentLogs.length; i++) {
        this.searchService.paymentLogs[i].selected = false;
        this.searchService.paymentLogs[i].payment_reference_id = this.getReferenceId(this.searchService.paymentLogs[i]);
        this.payments_logs.push(this.searchService.paymentLogs[i]);
      }
      this.searchService.paymentLogs = [];
    }
    return this.payments_logs;
  }
}
