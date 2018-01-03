import { Injectable } from '@angular/core';
import { IPaymentsLog } from '../../interfaces/payments-log';

@Injectable()
export class SearchService {
  paymentLogs: IPaymentsLog[];
  constructor() { }

  populatePaymentLogs (paymentLog: IPaymentsLog) {
    this.paymentLogs = []; // empty the list first, then populate
    this.paymentLogs.push(paymentLog);
  }
}
