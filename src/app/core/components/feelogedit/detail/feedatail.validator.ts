import { FeeDetailModel } from '../../../models/feedetail.model';

export class FeeDetailValidator {
  caseReference = true;
  feeDetail= true;

  isValid() {
    return this.caseReference && this.feeDetail;
  }

  validateCaseReference(feeDetail: FeeDetailModel): boolean {
    const isValid = !!feeDetail.case_reference;
    this.caseReference = isValid;
    return isValid;
  }

  validateFeeDetailData(feeDetail: FeeDetailModel): boolean {
    const isValid = !!feeDetail.fee_code &&
      !!feeDetail.fee_description &&
      !!feeDetail.fee_version &&
      !!feeDetail.amount;
    this.feeDetail = isValid;
    return isValid;
  }

  validateAll(feeDetail: FeeDetailModel): boolean {
    const isValidCaseRef = this.validateCaseReference(feeDetail);
    const isValidData = this.validateFeeDetailData(feeDetail);
    return isValidCaseRef && isValidData;
  }
}
