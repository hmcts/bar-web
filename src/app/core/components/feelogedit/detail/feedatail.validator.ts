import {FeeDetailModel} from '../../../models/feedetail.model';

export class FeeDetailValidator {
  caseReference = true;
  feeDetail = true;
  feeDetailAmount = true;
  remissionAmount = true;
  remissionAuthorization = true;
  errors = {
    caseReference: '',
    feeDetail: '',
    feeDetailAmount: '',
    remissionAmount: '',
    remissionAuthorisation: ''
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

  validateRemissionAmount(feeDetail: FeeDetailModel): boolean {
    const amount = feeDetail.remission_amount ? feeDetail.remission_amount.toString() : '';
    if (!amount || amount === '0') {
      this.remissionAmount = false;
      this.errors.remissionAmount = 'Remission amount must be greater than 0';
    } else {
      this.remissionAmount = true;
      this.errors.remissionAmount = '';
    }
    return this.remissionAmount;
  }

  validateRemissionAuthorization(feeDetail: FeeDetailModel): boolean {
    if (!feeDetail.remission_authorisation) {
      this.remissionAuthorization = false;
      this.errors.remissionAuthorisation = 'Enter remission authorisation';
    } else if (feeDetail.remission_authorisation.length !== 11) {
      this.remissionAuthorization = false;
      this.errors.remissionAuthorisation = 'Remission authorisation must be 11 characters';
    } else {
      this.remissionAuthorization = true;
      this.errors.remissionAuthorisation = '';
    }
    return this.remissionAuthorization;
  }

  validateFeeAmount(feeDetail: FeeDetailModel): boolean {
    this.feeDetailAmount = !!feeDetail.amount;
    return this.feeDetailAmount;
  }

  validateAll(feeDetail: FeeDetailModel, remissionVisible: boolean): boolean {
    const isValidCaseRef = this.validateCaseReference(feeDetail);
    const isValidData = this.validateFeeDetailData(feeDetail);
    const isValidAmount = this.validateFeeAmount(feeDetail);
    let isRemissionValid = true;
    if (remissionVisible) {
      isRemissionValid = isRemissionValid && this.validateRemissionAmount(feeDetail) && this.validateRemissionAuthorization(feeDetail);
    }
    return isValidCaseRef && isValidData && isValidAmount && isRemissionValid;
  }
}
