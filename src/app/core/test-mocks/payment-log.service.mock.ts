import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import {IResponse} from '../interfaces';
import {getPaymentInstructions} from '../../test-utils/test-utils';
import {SearchModel} from '../models/search.model';

export class PaymentLogServiceMock {
  getPaymentsLog(searchModel: SearchModel): PaymentInstructionModel[] {
    return getPaymentInstructions();
  }

  getPaymentById(feeId: number): PaymentInstructionModel {
    return new PaymentInstructionModel();
  }

  getUnallocatedAmount(feeId: number) {
    return new PaymentInstructionModel();
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

