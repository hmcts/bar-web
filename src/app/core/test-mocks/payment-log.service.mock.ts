import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import {IResponse} from '../interfaces';

export class PaymentLogServiceMock {
  getPaymentsLog(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return new Promise(resolve => resolve(paymentInstructionModels));
  }

  getPaymentById(feeId: number): PaymentInstructionModel {
    return new PaymentInstructionModel();
  }

  getUnallocatedAmount(feeId: number) {
    return new PaymentInstructionModel();
  }

  createCaseNumber(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return new Promise(resolve => resolve(paymentInstructionModels));
  }

  getPaymentsLogByUser(): IResponse {
    const data = [];
    const success = true;
    return { data, success };
  };

}

