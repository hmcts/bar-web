import { PaymentParent } from './payment-parent.model';
import { IPaymentsLog } from '../interfaces/payments-log';
import { PaymentTypeModel } from './paymenttype.model';
import { FeeDetailModel } from './feedetail.model';
import { WithdrawReasonModel } from './withdrawreason.model';
import { ReturnReasonModel } from './returnreason.model';
import { isUndefined } from 'lodash';

export class PaymentInstructionModel extends PaymentParent implements IPaymentsLog {
  action: string;
  action_comment: string;
  action_reason: string;
  amount: number = null;
  currency = 'GBP';
  payer_name: string = null;
  unallocated_amount = 0;
  bgc_number?: string;
  withdrawReasonModel = new WithdrawReasonModel;
  returnReasonModel = new ReturnReasonModel;

  assign(data) {
    Object.keys(data).forEach(key => this[key] = data[key]);

    if (!isUndefined(data.case_fee_details)) {
      this.case_fee_details = data.case_fee_details.map(caseFeeDetail => {
        const caseFeeDetailModel = new FeeDetailModel();
        caseFeeDetailModel.assign(caseFeeDetail);
        return caseFeeDetailModel;
      });
    }
    if (!isUndefined(data.action_comment)) {
      this.action_comment = data.action_comment;
    }

    if (!isUndefined(data.action_reason)) {
      this.action_reason = data.action_reason;
    }

    if (!isUndefined(data.payment_type)) {
      this.payment_type = new PaymentTypeModel;
      this.payment_type.id = data.payment_type.id;
      this.payment_type.name = data.payment_type.name;
    }
  }
}
