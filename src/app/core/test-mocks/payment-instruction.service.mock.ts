import {CheckAndSubmit} from '../models/check-and-submit';
import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import { getPaymentInstructions } from '../../test-utils/test-utils';
import { of } from 'rxjs/observable/of';

export class PaymentInstructionServiceMock {

  getPaymentInstructions() {
    return of(getPaymentInstructions());
  }

  transformIntoCheckAndSubmitModel(paymentInstructions: PaymentInstructionModel[]): CheckAndSubmit[]  {
    const checkAndSubmitModels: CheckAndSubmit[] = [];
    let i;

    for (i = 0; i < paymentInstructions.length; i++) {
      const model = new CheckAndSubmit();
      model.convertTo(paymentInstructions[i]);
      checkAndSubmitModels.push(model);
    }

    return checkAndSubmitModels;
  }
}
