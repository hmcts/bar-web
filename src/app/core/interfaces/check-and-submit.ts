import { IPaymentType } from '.';

export interface ICheckAndSubmit {
  paymentId?: number;
  paymentAmount?: number;
  selected?: boolean;
  fee?: number;
  remission?: number;
  refund?: number;
  paymentType?: IPaymentType;
  date?: Date;
}
