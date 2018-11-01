import { PaymentParent } from './payment-parent.model';
import { IPaymentsLog } from '../interfaces/payments-log';
import { PaymentTypeModel } from './paymenttype.model';
import { FeeDetailModel } from './feedetail.model';
import { WithdrawReasonModel } from './withdrawreason.model';

export class PaymentInstructionModel extends PaymentParent implements IPaymentsLog {
  amount: number = null;
  currency = 'GBP';
  payer_name: string = null;
  unallocated_amount = 0;
  bgc_number?: string;
  withdraw_reason?: string;
  withdraw_comment?: string;
  withdrawReasonModel = new WithdrawReasonModel;

  assign(data) {
    Object.keys(data).forEach(key => {
      if (key === 'payment_type') {
        this.payment_type = new PaymentTypeModel;
        this.payment_type.id = data[key].id;
        this.payment_type.name = data[key].name;
      } else if (key === 'case_fee_details') {
        this.case_fee_details = data[key].map(caseFeeDetail => {
          const caseFeeDetailModel = new FeeDetailModel();
          caseFeeDetailModel.assign(caseFeeDetail);
          return caseFeeDetailModel;
        });
      } else if (key === 'action_reason') {
        this.withdraw_reason = this.withdrawReasonModel.getReasonById(data[key]).reason;
      } else if (key === 'action_comment') {
        this.withdraw_comment = data[key];
      } else {
        this[key] = data[key];
      }
    });
  }
}
