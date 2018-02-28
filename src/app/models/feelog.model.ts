import { IPaymentsLog, ICaseReference } from './../interfaces/payments-log';
import { PaymentParent } from './payment-parent.model';
import { CaseReferenceModel } from './casereference';
import { CaseFeeDetailModel } from './casefeedetail';
import { IPaymentType } from '../interfaces/index';
import { PaymentTypeModel } from './paymenttype.model';

export class FeeLogModel extends PaymentParent {

  unallocated_amount: number = 0;

  assign(data: any) {
    const properties = Object.keys(data);
    for (let i = 0; i < properties.length; i++) {
      const property = data[properties[i]];
      if (properties[i] === 'case_references') {
        this.assignCaseReferences(data[properties[i]]);
      } else if (properties[i] === 'payment_type') {
        this.payment_type = new PaymentTypeModel();
        this.payment_type.id = data[properties[i]].id;
        this.payment_type.name = data[properties[i]].name;
      } else {
        this[properties[i]] = data[properties[i]];
      }
    }
  }

  private assignCaseReferences(property) {
    let caseReferenceModels: CaseReferenceModel[] = [];

    if (property.length > 0) {
      caseReferenceModels = property.map(caseReference => {
        const crm = new CaseReferenceModel();
        crm.assign( caseReference );
        return crm;
      });
    }

    this.case_references = caseReferenceModels;
  }

}
