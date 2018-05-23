import { IPaymentType } from '../interfaces/index';

export class PaymentTypeModel implements IPaymentType {
  id: string;
  name: string;

  static createPaymentTypeModel(id: string, name: string) {
    const ptm = new PaymentTypeModel();
    ptm.id = id;
    ptm.name = name;
    return ptm;
  }

  assign(data) {
    this.id = data.id;
    this.name = data.name;
  }
}
