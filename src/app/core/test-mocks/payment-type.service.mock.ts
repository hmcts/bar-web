import {PaymentTypeModel} from '../models/paymenttype.model';
import { PaymentInstructionModel } from '../models/paymentinstruction.model';
import { IResponse, IPaymentType } from '../interfaces';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PaymentTypeEnum } from '../models/payment.type.enum';

export class PaymentTypeServiceMock {

  paymentTypesSource = new BehaviorSubject<any>({});

  getPaymentTypes(): Observable<IPaymentType[]> {
    const paymentTypeEnum = new PaymentTypeEnum();
    const data: IPaymentType[] = new Array<IPaymentType>();
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.CHEQUE, 'Cheque'));
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.CARD, 'Card'));
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.CASH, 'Cash'));
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.ALLPAY, 'All Pay'));
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.POSTAL_ORDER, 'Postal Order'));
    data.push(PaymentTypeModel.createPaymentTypeModel(paymentTypeEnum.FULL_REMISSION, 'Full Remission'));
    return of(data);
  }

  savePaymentModel(data: PaymentInstructionModel): Observable<IResponse> {
    return new Observable(observer => {
      observer.next({ success: true, data: null });
      observer.complete();
    });
  }
}
