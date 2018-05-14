import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import { createPaymentInstruction } from '../../test-utils/test-utils';

export class PaymentLogServiceMock {
  getPaymentsLog(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return Promise.resolve(paymentInstructionModels);
  }

  getPaymentById(feeId: number): Promise<any> {
    return Promise.resolve({data: createPaymentInstruction(), success: true});
  }

  getUnallocatedAmount(feeId: number): Promise<any> {
    return Promise.resolve({data: 0, success: true});
  }

  createCaseNumber(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();
    return new Promise(resolve => resolve(paymentInstructionModels));
  }
}

