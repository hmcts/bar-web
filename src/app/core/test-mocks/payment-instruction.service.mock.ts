import {CheckAndSubmit} from '../models/check-and-submit';
import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import { getPaymentInstructions } from '../../test-utils/test-utils';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { IResponse } from '../interfaces';

export class PaymentInstructionServiceMock {

  getPaymentInstructions() {
    return of(getPaymentInstructions());
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: PaymentInstructionModel[]): CheckAndSubmit[]  {
    const checkAndSubmitModels: CheckAndSubmit[] = [];
    let i;

    for (i = 0; i < paymentInstructions.length; i++) {
      const model = new CheckAndSubmit();
      model.convertTo(paymentInstructions[i]);
      checkAndSubmitModels.push(model);
    }

    return checkAndSubmitModels;
  }

  savePaymentInstruction(paymentInstruction: PaymentInstructionModel): Observable<IResponse> {
    return new Observable(observer => {
      observer.next({success: true, data: null});
      observer.complete();
    });
  }
}
