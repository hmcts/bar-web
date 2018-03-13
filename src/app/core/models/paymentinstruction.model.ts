import { PaymentParent } from './payment-parent.model';
import { IPaymentsLog } from '../interfaces/payments-log';
import { IPaymentType } from '../interfaces/payment-types';
import { PaymentTypeModel } from './paymenttype.model';
import { CaseReferenceModel } from './casereference';

export class PaymentInstructionModel extends PaymentParent implements IPaymentsLog {
  action: string;
  currency = 'GBP';

  assign(data) {
    const properties = Object.keys(data);

    for (let i = 0; i < properties.length; i++) {
      if (properties[i] === 'payment_type') {
        this.payment_type = new PaymentTypeModel;
        this.payment_type.id = data[properties[i]].id;
        this.payment_type.name = data[properties[i]].name;
      } else if (properties[i] === 'case_references') {
        this.case_references = data[properties[i]].map(caseReference => {
          const caseRef = new CaseReferenceModel();
          caseRef.assign(caseReference);
          return caseRef;
        });
      } else {
        this[properties[i]] = data[properties[i]];
      }
    }
  }
}
