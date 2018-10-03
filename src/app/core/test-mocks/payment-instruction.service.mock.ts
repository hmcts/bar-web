import {CheckAndSubmit} from '../models/check-and-submit';
import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import {createPaymentInstruction, getPaymentInstructions} from '../../test-utils/test-utils';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {IResponse} from '../interfaces';
import {SearchModel} from '../models/search.model';
import { mock, instance } from 'ts-mockito';
import { PaymentStatus } from '../models/paymentstatus.model';

export class PaymentInstructionServiceMock {

  getPaymentInstructions() {
    return of(getPaymentInstructions());
  }

  getPaymentInstructionById() {
    const paymentInstruction = createPaymentInstruction();
    return new Observable(ob => {
      ob.next({ success: true, data: paymentInstruction });
      ob.complete();
    });
  }

  savePaymentInstruction(paymentInstruction: PaymentInstructionModel): Promise<IResponse> {
    const data = {
      ...paymentInstruction,
      ...{ id: 1, daily_sequence_id: 123 }
    };
    return Promise.resolve({ success: true, data });
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

  getCount(searchModel: SearchModel) {
    return of({
      success: true,
      data: 4
    });
  }

  transformIntoPaymentInstructionModel(checkAndSubmitModel: CheckAndSubmit): PaymentInstructionModel {
    const pim = instance(mock(PaymentInstructionModel));
    pim.status = checkAndSubmitModel.status === PaymentStatus.PENDINGAPPROVAL ? 'PA' :
      checkAndSubmitModel.status === PaymentStatus.APPROVED ? 'A' : 'TTB';
    return pim;
  }

}
