import {Component, OnInit} from '@angular/core';
import {IPaymentsLog} from '../../interfaces/payments-log';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymentStatus} from '../../models/paymentstatus.model';

import {UtilService} from '../../../shared/services/util/util.service';
import {IResponse} from '../../interfaces/index';
import {map, take} from 'rxjs/operators';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {PaymentsOverviewService} from '../../services/paymentoverview/paymentsoverview.service';

@Component({
  selector: 'app-payment-instruction-list',
  templateUrl: './payment-instruction-list.component.html',
  providers: [PaymentInstructionsService, PaymentslogService, PaymentsOverviewService],
  styleUrls: ['./payment-instruction-list.component.scss']
})
export class PaymentInstructionListComponent implements OnInit {
  loading = false;
  paymentInstructions$: BehaviorSubject<IPaymentsLog[]> = new BehaviorSubject<IPaymentsLog[]>([]);
  currentPaymentInstructions: IPaymentsLog[] = [];
  paymentStatus: { label: string, constant: PaymentStatus };

  count = {
    pending: 0,
    rejected: 0
  };

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _paymentOverviewService: PaymentsOverviewService) {
      this.paymentStatus = { constant: PaymentStatus.PENDING, label: 'Pending' }; // set default payment status
    }

  ngOnInit(): void {
    this.getPaymentInstructions();
    this.getPaymentInstructionCounts();
  }

  countPaymentInstructionsByStatus(status: string) {
    return this.paymentInstructions$
      .getValue()
      .filter(paymentInstruction => paymentInstruction.status === status).length;
  }

  getPaymentInstructions() {
    this.loading = true;

    this._paymentInstructionService
      .getPaymentInstructions([PaymentStatus.PENDING, PaymentStatus.REJECTED])
      .pipe(take(1), map((response: IResponse) => this._paymentInstructionService.transformJsonIntoPaymentInstructionModels(response.data)))
      .subscribe(
        data => {
          this.paymentInstructions$.next(data);
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
        });
  }

  getPaymentInstructionsByStatus(status: string) {
    return this.paymentInstructions$
      .getValue()
      .filter(paymentInstructionModel => paymentInstructionModel.status === status);
  }

  isCurrentStatus(paymentStatus: PaymentStatus, status: string) {
    return this.paymentStatus.constant === status;
  }

  selectPaymentStatus(paymentStatus: string) {
    const paymentStatusUpperCase = paymentStatus.toUpperCase();
    const paymentStatusStripped = paymentStatusUpperCase.replace(' ', '');

    if (PaymentStatus[paymentStatusStripped]) {
      this.paymentStatus = {
        constant: PaymentStatus[paymentStatusStripped],
        label: UtilService.convertToUpperCase(paymentStatusUpperCase)
      };
    }

  }

  getPaymentInstructionCounts(): void {
    const pendingCount = this._paymentOverviewService.getPaymentInstructionCount(PaymentStatus.getPayment('P').code);
    const rejectedCount = this._paymentOverviewService.getPaymentInstructionCount(PaymentStatus.getPayment('REJ').code);

    forkJoin([pendingCount,  rejectedCount]).subscribe({
      next: (result: IResponse[]) => {
        const [ pending, rejected] = result;
        this.count.pending = pending.data;
        this.count.rejected = rejected.data;
      }
    });
  }

}
