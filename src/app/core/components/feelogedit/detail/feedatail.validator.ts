import { FeeDetailModel } from '../../../models/feedetail.model';

export class FeeDetailValidator {
  caseReference = true;
  feeDetail = true;
  feeDetailAmount = true;
  errors = {
    caseReference: '',
    feeDetail: '',
    feeDetailAmount: ''
  };

  isValid() {
    return this.caseReference && this.feeDetail;
  }

  validateCaseReference(feeDetail: FeeDetailModel): boolean {
    if (!feeDetail.case_reference) {
      this.caseReference = false;
      this.errors.caseReference = 'Enter case number';
    } else if (feeDetail.case_reference.length < 3) {
      this.caseReference = false;
      this.errors.caseReference = 'Case number must be at least 3 characters';
    } else {
      this.caseReference = true;
      this.errors.caseReference = '';
    }
    return this.caseReference;
  }

  validateFeeDetailData(feeDetail: FeeDetailModel): boolean {
    const isValid = !!feeDetail.fee_code &&
      !!feeDetail.fee_description &&
      !!feeDetail.fee_version;
    this.feeDetail = isValid;
    return isValid;
  }

  validateFeeAmount(feeDetail: FeeDetailModel): boolean {
    this.feeDetailAmount = !!feeDetail.amount;
    return this.feeDetailAmount;
  }

  validateAll(feeDetail: FeeDetailModel): boolean {
    const isValidCaseRef = this.validateCaseReference(feeDetail);
    const isValidData = this.validateFeeDetailData(feeDetail);
    const isValidAmount = this.validateFeeAmount(feeDetail);
    return isValidCaseRef && isValidData && isValidAmount;
  }
}
