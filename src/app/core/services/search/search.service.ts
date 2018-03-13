import { Injectable } from '@angular/core';
import { IPaymentsLog } from '../../interfaces/payments-log';

@Injectable()
export class SearchService {
  paymentLogs: IPaymentsLog[];
  isSearchOperationPerformed: boolean;
  constructor() { }

  populatePaymentLogs (paymentLogs: IPaymentsLog[]) {
    this.isSearchOperationPerformed = true;
    this.paymentLogs = []; // empty the list first, then populate
    this.paymentLogs = paymentLogs;
  }
}
