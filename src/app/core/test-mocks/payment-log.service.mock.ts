import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import {IResponse} from '../interfaces';
import {getPaymentInstructions} from '../../test-utils/test-utils';
import {SearchModel} from '../models/search.model';
import { createPaymentInstruction } from '../../test-utils/test-utils';

export class PaymentLogServiceMock {
  getPaymentsLog(user: any, status: any): Promise<any> {
    return Promise.resolve({data: [createPaymentInstruction()], success: true});
  }

  getPaymentById(feeId: number): Promise<any> {
    return Promise.resolve({data: createPaymentInstruction(), success: true});
  }

  getUnallocatedAmount(feeId: number): Promise<any> {
    return Promise.resolve({data: 0, success: true});
  }

  createCaseNumber(): Promise<PaymentInstructionModel[]> {
    const paymentInstructionModels: PaymentInstructionModel[] = [];
    return new Promise(resolve => resolve(paymentInstructionModels));
  }

  getPaymentsLogByUser(searchModel: SearchModel): IResponse {
    const data = getPaymentInstructions();
    const success = true;

    return { data, success };
  }

}

