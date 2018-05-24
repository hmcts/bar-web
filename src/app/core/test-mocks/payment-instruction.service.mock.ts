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

  getPaymentInstructionById() {
    const paymentInstruction = new PaymentInstructionModel();
    return new Observable(ob => {
      ob.next({ success: true, data: paymentInstruction });
      ob.complete();
    });
  }

  savePaymentInstruction(paymentInstruction: PaymentInstructionModel): Observable<IResponse> {
    return new Observable(observer => {
      observer.next({success: true, data: paymentInstruction});
      observer.complete();
    });
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

}
