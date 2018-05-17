import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchService } from '../../services/search/search.service';

import { UtilService } from '../../../shared/services/util/util.service';
import { IResponse } from '../../interfaces/index';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  loading = false;
  paymentInstructionsAll: IPaymentsLog[] = [];
  currentPaymentInstructions: IPaymentsLog[] = [];
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private router: Router,
    private searchService: SearchService) { }

  ngOnInit() {
    this.getPendingPaymentInstructions();
    this.getRejectedInstructions();
    this.getPaymentLogs();
  }

  get countPendingPayments() {
    return this.paymentInstructionsAll
      .filter(paymentInstruction => paymentInstruction.status === 'Pending').length;
  }

  get countRejectedPayments() {
    return this.paymentInstructionsAll
      .filter(paymentInstruction => paymentInstruction.status === 'Rejected').length;
  }

  get searchResults() {
    // Check if there is a search operation performed
    if (this.searchService.isSearchOperationPerformed === true) {
      this.paymentInstructionsAll = [];
      this.searchService.isSearchOperationPerformed = false; // Reset the boolean to false for future requests
    }

    if (this.searchService.paymentLogs && this.searchService.paymentLogs.length > 0) {
      for (let i = 0; i < this.searchService.paymentLogs.length; i++) {
        this.searchService.paymentLogs[i].selected = false;
        // this.searchService.paymentLogs[i].payment_reference_id = this.getReferenceId(this.searchService.paymentLogs[i]);
        this.paymentInstructionsAll.push(this.searchService.paymentLogs[i]);
      }
      this.searchService.paymentLogs = [];
    }
    return this.paymentInstructionsAll;
  }

  getPendingPaymentInstructions() {}
  getRejectedInstructions() {}

  getPaymentLogs() {
    this.paymentInstructionsAll = [];
    this.loading = true;

    this.paymentsLogService
      .getAllPaymentInstructions([PaymentStatus.PENDING, PaymentStatus.REJECTED])
      .subscribe(
        (response: IResponse) => {
          if (!response.success) {}
          response.data.forEach((payment: IPaymentsLog) => {
            const paymentInstruction = new PaymentInstructionModel();
            paymentInstruction.assign(payment);
            paymentInstruction.selected = false;
            this.paymentInstructionsAll.push(paymentInstruction);
          });
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
        });
  }

  // events go here ----------------------------------------------
  onFormSubmission() {}
}
