import {PaymentTypeModel} from '../models/paymenttype.model';
import { PaymentInstructionModel } from '../models/paymentinstruction.model';
import { IResponse, IPaymentType } from '../interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class PaymentTypeServiceMock {
  paymentTypesSource = new BehaviorSubject<any>({});

  getPaymentTypes(): Promise<IResponse> {
    const success = true;
    const data: PaymentTypeModel[] = new Array<PaymentTypeModel>();
    data.push(PaymentTypeModel.createPaymentTypeModel('cheques', 'Cheque'));
    data.push(PaymentTypeModel.createPaymentTypeModel('cards', 'Card'));
    data.push(PaymentTypeModel.createPaymentTypeModel('cash', 'Cash'));
    data.push(PaymentTypeModel.createPaymentTypeModel('allpay', 'All Pay'));
    data.push(PaymentTypeModel.createPaymentTypeModel('postal-orders', 'Postal Order'));
    return Promise.resolve({success, data});
  }

  savePaymentModel(data: PaymentInstructionModel): Promise<IResponse> {
    return Promise.resolve({ success: true, data: null });
  }

  setPaymentTypeList(data: IPaymentType[]): void {
    this.paymentTypesSource.next(data);
  }
}
