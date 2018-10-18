import { Observable, BehaviorSubject } from 'rxjs';
import { IPaymentsLog } from '../interfaces/payments-log';
import { PaymentInstructionModel } from '../models/paymentinstruction.model';

export class SearchServiceMock {
  paymentInstructions$: BehaviorSubject<IPaymentsLog[]> = new BehaviorSubject([]);
  currentpaymentInstructionsList = this.paymentInstructions$.asObservable();
  paymentInstructions: IPaymentsLog[];

  createPaymentInstructions(data: PaymentInstructionModel[]): void {
    this.paymentInstructions$.next(data);
  }
}
