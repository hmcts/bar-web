import {PaymentTypeModel} from '../models/paymenttype.model';
import { PaymentInstructionModel } from '../models/paymentinstruction.model';
import { IResponse, IPaymentType } from '../interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import { Observable } from 'rxjs/Observable';

export class PaymentTypeServiceMock {
  paymentTypeEnum = new PaymentTypeEnum();
  paymentTypesSource = new BehaviorSubject<any>({});

  getPaymentTypes(): Promise<IResponse> {
    const success = true;
    const data: PaymentTypeModel[] = new Array<PaymentTypeModel>();
    data.push(PaymentTypeModel.createPaymentTypeModel(this.paymentTypeEnum.CHEQUE, 'Cheque'));
    data.push(PaymentTypeModel.createPaymentTypeModel(this.paymentTypeEnum.CARD, 'Card'));
    data.push(PaymentTypeModel.createPaymentTypeModel(this.paymentTypeEnum.CASH, 'Cash'));
    data.push(PaymentTypeModel.createPaymentTypeModel(this.paymentTypeEnum.ALLPAY, 'All Pay'));
    data.push(PaymentTypeModel.createPaymentTypeModel(this.paymentTypeEnum.POSTAL_ORDER, 'Postal Order'));
    return Promise.resolve({success, data});
  }

  savePaymentModel(data: PaymentInstructionModel): Observable<IResponse> {
    return new Observable(observer => {
      observer.next({ success: true, data: null });
      observer.complete();
    });
  }

  setPaymentTypeList(data: IPaymentType[]): void {
    this.paymentTypesSource.next(data);
  }
}
