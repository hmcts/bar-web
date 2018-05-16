import {CheckAndSubmit} from '../models/check-and-submit';
import {PaymentInstructionModel} from '../models/paymentinstruction.model';

export class PaymentInstructionServiceMock {
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
