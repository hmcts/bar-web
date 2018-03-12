import { ICaseReference, ICaseFeeDetail } from '../interfaces/payments-log';
import { CaseFeeDetailModel } from './casefeedetail';

export class CaseReferenceModel implements ICaseReference {
  id: number;
  case_reference: string;
  payment_instruction_id: number;
  case_fee_details: ICaseFeeDetail[];

  assign(caseReference) {
    this.id = caseReference.id;
    this.payment_instruction_id = caseReference.payment_instruction_id;
    this.case_fee_details = [];
    this.case_reference = caseReference.case_reference;

    if (caseReference.case_fee_details.length > 0) {
      this.case_fee_details = caseReference.case_fee_details.map(caseFeeDetail => {
        const cfd = new CaseFeeDetailModel();
        cfd.assign(caseFeeDetail);
        return cfd;
      });
    }
  }

  getReference() {
    // let refId = '-';
    // if (data.payment_type) {
    //   switch (data.payment_type.id) {
    //     case 'cheques':
    //       refId = data.cheque_number;
    //       break;
    //     case 'postal-orders':
    //       refId = data.postal_order_number;
    //       break;
    //     case 'allpay':
    //       refId = data.all_pay_transaction_id;
    //       break;
    //     default:
    //       refId = '-';
    //   }
    // }
    // return refId;
  }
}
