import { Component, OnInit } from '@angular/core';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';

import { UtilService } from '../../../shared/services/util/util.service';
import { IResponse } from '../../interfaces/index';
import { map, take } from 'rxjs/operators';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { BaseComponent } from '../../../shared/components/base.component';

@Component({
  selector: 'app-payment-instruction-list',
  templateUrl: './payment-instruction-list.component.html',
  providers: [PaymentInstructionsService, PaymentslogService],
  styleUrls: ['./payment-instruction-list.component.scss']
})
export class PaymentInstructionListComponent extends BaseComponent implements OnInit {
  loading = false;
  paymentInstructions$: BehaviorSubject<IPaymentsLog[]> = new BehaviorSubject<IPaymentsLog[]>([]);
  currentPaymentInstructions: IPaymentsLog[] = [];
  paymentStatus: { label: string, constant: PaymentStatus };

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    paymentStateService: PaymentstateService) {
      super(paymentStateService);
      this.paymentStatus = { constant: PaymentStatus.PENDING, label: 'Pending' }; // set default payment status
    }

  runAfterInit() {
    this.getPaymentInstructions();
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
}
