import { IPaymentType } from './payment-types';
import { PaymentTypeEnum } from '../models/payment.type.enum';

export interface IPaymentState {
  state: { paymentTypes: Promise<IPaymentType[]>, currentOpenedFeeTab: number, paymentTypeEnum: Promise<PaymentTypeEnum> };
}
