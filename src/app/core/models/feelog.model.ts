import { IPaymentsLog } from './../interfaces/payments-log';
import { PaymentParent } from './payment-parent.model';
import { CaseFeeDetailModel } from './casefeedetail';
import { IPaymentType } from '../interfaces/index';
import { PaymentTypeModel } from './paymenttype.model';
import { FeeDetailModel } from './feedetail.model';

export class FeeLogModel extends PaymentParent implements IPaymentsLog {
  unallocated_amount = 0;

  assign(data: any) {
    const properties = Object.keys(data);

    for (let i = 0; i < properties.length; i++) {
      if (properties[i] === 'payment_type') {
        this.payment_type = new PaymentTypeModel;
        this.payment_type.id = data[properties[i]].id;
        this.payment_type.name = data[properties[i]].name;
      } else if (properties[i] === 'case_fee_details') {
        this.case_fee_details = data[properties[i]].map(caseFeeDetail => {
          const caseFeeDetailModel = new FeeDetailModel();
          caseFeeDetailModel.assign(caseFeeDetail);
          return caseFeeDetailModel;
        });
      } else {
        this[properties[i]] = data[properties[i]];
      }
    }
  }

}
