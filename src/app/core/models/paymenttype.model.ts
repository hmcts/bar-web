import { IPaymentType } from '../interfaces/index';

export class PaymentTypeModel implements IPaymentType {
  id: string;
  name: string;

  assign(data) {
    this.id = data.id;
    this.name = data.name;
  }
}
