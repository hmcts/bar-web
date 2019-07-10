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
  paymentStatus = { label: 'Pending', constant: PaymentStatus.PENDING };

  count = {
    pending: 0,
    rejected: 0
  };

  page: number;
  recordPerPage: number;
  totalPages: number;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _paymentOverviewService: PaymentsOverviewService) {}

  ngOnInit(): void {
    this.page = 0;
    this.recordPerPage = 50;
    this.totalPages = 0;

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
      .getPaymentInstructions([PaymentStatus.PENDING, PaymentStatus.REJECTED], this.page, this.recordPerPage)
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

 getPagelist(page: number, event: any) {
    event.preventDefault();

    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getPaymentInstructions();
    } else {
      event.stopPropagation();
    }
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
        const totalRecords = (this.count.pending + this.count.rejected);

        this.totalPages = Math.ceil(totalRecords / this.recordPerPage);
      }
    });
  }

}
