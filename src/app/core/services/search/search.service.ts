import { Injectable } from '@angular/core';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';

@Injectable()
export class SearchService {
  paymentInstructions$: BehaviorSubject<IPaymentsLog[]> = new BehaviorSubject([]);
  paymentLogs: IPaymentsLog[];
  isSearchOperationPerformed: boolean;
  constructor() { }

  currentpaymentInstructionsList = this.paymentInstructions$.asObservable();

  populatePaymentLogs (paymentLogs: IPaymentsLog[]) {
    this.isSearchOperationPerformed = true;
    this.paymentLogs = []; // empty the list first, then populate
    this.paymentLogs = paymentLogs;
  }

  createPaymentInstructions(paymentInstructions: PaymentInstructionModel[]): void {
    this.paymentInstructions$.next(paymentInstructions);
  }
}
