import {CheckAndSubmit} from '../models/check-and-submit';
import {PaymentInstructionModel} from '../models/paymentinstruction.model';
import {createPaymentInstruction, getPaymentInstructions} from '../../test-utils/test-utils';
import {IResponse} from '../interfaces';
import {SearchModel} from '../models/search.model';
import { mock, instance } from 'ts-mockito';
import { PaymentStatus } from '../models/paymentstatus.model';
import { Observable, of } from 'rxjs';

export class PaymentInstructionServiceMock {

  getPaymentInstructions() {
    return of(getPaymentInstructions());
  }

  getPaymentInstructionById() {
    const paymentInstruction = createPaymentInstruction();
    return of({ success: true, data: paymentInstruction });
  }

  savePaymentInstruction(paymentInstruction: PaymentInstructionModel): Observable<IResponse> {
    const data = {
      ...paymentInstruction,
      ...{ id: 1, daily_sequence_id: 123 }
    };
    return new Observable(observer => {
      observer.next({success: true, data });
      observer.complete();
    });
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: PaymentInstructionModel[]): CheckAndSubmit[]  {
    return paymentInstructions.map(model => {
      const checkAndSubmitModel = new CheckAndSubmit();
      checkAndSubmitModel.convertTo(model);
      return checkAndSubmitModel;
    });
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

  transformJsonIntoPaymentInstructionModels(data): PaymentInstructionModel[] {
    const models: PaymentInstructionModel[] = [];
    return models;
  }
}
