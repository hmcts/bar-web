import {FeeDetailModel} from '../models/feedetail.model';

export class FeelogServiceMock {

  getFeeCodesAndDescriptions(code: string): Promise<any> {
    return new Promise(resolve => resolve([]));
  }

  addEditFeeToCase(paymentInstructionId: string, data: FeeDetailModel, method = 'post'): Promise<any> {
    return new Promise(resolve => resolve({}));
  }
}
