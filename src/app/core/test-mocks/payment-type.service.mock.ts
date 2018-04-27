import {PaymentTypeModel} from '../models/paymenttype.model';

export class PaymentTypeServiceMock {
  getPaymentTypes(): Promise<PaymentTypeModel> {
    const paymentTypeModels: PaymentTypeModel[] = new Array<PaymentTypeModel>();
    return new Promise(resolve => resolve(paymentTypeModels));
  }
}
