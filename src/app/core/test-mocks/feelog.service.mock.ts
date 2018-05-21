import {FeeDetailModel} from '../models/feedetail.model';
import { CaseFeeDetailModel } from '../models/casefeedetail';
import { ICaseFeeDetail } from '../interfaces/payments-log';

export class FeelogServiceMock {

  getFeeCodesAndDescriptions(code: string): Promise<any> {
    return new Promise(resolve => resolve([]));
  }

  addEditFeeToCase(paymentInstructionId: string, data: FeeDetailModel, method = 'post'): Promise<any> {
    return new Promise(resolve => resolve({}));
  }

  removeFeeFromPaymentInstruction(caseFeeDetail: ICaseFeeDetail): Promise<any> {
    return Promise.resolve();
  }
}
