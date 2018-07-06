import { PaymentParent } from './payment-parent.model';
import { IPaymentsLog } from '../interfaces/payments-log';
import { PaymentTypeModel } from './paymenttype.model';
import { FeeDetailModel } from './feedetail.model';
import * as _ from 'lodash';

export class PaymentInstructionModel extends PaymentParent implements IPaymentsLog {
  action: string;
  amount: number = null;
  currency = 'GBP';
  payer_name: string = null;
  unallocated_amount = 0;
  bgc_number?: string;

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
      } else {
        this[key] = data[key];
      }
    });
  }

  hasAllFieldsFilled() {
    if (Object.keys(this).length < 1) {
      return false;
    }

    return (_
      .chain(Object.keys(this))
      .reject(key => (key === 'currency') || (key === 'unallocated_amount') || (key === 'payment_type') || (key === 'case_fee_details'))
      .map(field => this[field])
      .filter(value => (_.isNull(value) || _.isEqual(value, '') || (_.isString(value) && value.trim().length < 1))
      ? true
      : false)
      .value().length > 0) ? false : true;
  }
}
