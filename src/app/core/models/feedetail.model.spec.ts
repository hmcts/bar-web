import {FeeDetailModel} from './feedetail.model';

describe('check feedetail method', () => {

  it('test abs equals methods', () => {
    const feeDetailModel1 = new FeeDetailModel();
    feeDetailModel1.amount = 500;
    feeDetailModel1.remission_amount = 300;
    feeDetailModel1.refund_amount = 100;

    const feeDetailModel2 = new FeeDetailModel();
    feeDetailModel2.amount = 500;
    feeDetailModel2.remission_amount = 300;
    feeDetailModel2.refund_amount = 100;

    expect(feeDetailModel1.absEquals(feeDetailModel2)).toBe(false);

  });

  it('test abs equals methods', () => {
    const feeDetailModel1 = new FeeDetailModel();
    feeDetailModel1.amount = 500;
    feeDetailModel1.remission_amount = 300;
    feeDetailModel1.refund_amount = 100;

    const feeDetailModel2 = new FeeDetailModel();
    feeDetailModel2.amount = -500;
    feeDetailModel2.remission_amount = -300;
    feeDetailModel2.refund_amount = -100;

    expect(feeDetailModel1.absEquals(feeDetailModel2)).toBe(true);

  });

  it('test abs equals methods', () => {
    const feeDetailModel1 = new FeeDetailModel();
    feeDetailModel1.amount = 500;
    feeDetailModel1.remission_amount = 300;
    feeDetailModel1.refund_amount = 100;

    const feeDetailModel2 = new FeeDetailModel();
    feeDetailModel2.amount = 500;
    feeDetailModel2.refund_amount = 100;

    expect(feeDetailModel1.absEquals(feeDetailModel2)).toBe(false);

  });

  it('test to ensure all fields are empty after reset', () => {
    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.amount = null;
    feeDetailModel.fee_code = '';
    feeDetailModel.fee_description = '';
    feeDetailModel.fee_version = '';
    feeDetailModel.remission_amount = null;
    feeDetailModel.remission_benefiter = '';
    feeDetailModel.remission_authorisation = '';
    feeDetailModel.refund_amount = 23.99;
    feeDetailModel.reset();

    const feeDetailModelBlank = new FeeDetailModel();
    feeDetailModelBlank.amount = null;
    feeDetailModelBlank.fee_code = '';
    feeDetailModelBlank.fee_description = '';
    feeDetailModelBlank.fee_version = '';
    feeDetailModelBlank.remission_amount = null;
    feeDetailModelBlank.remission_benefiter = '';
    feeDetailModelBlank.remission_authorisation = '';
    feeDetailModelBlank.refund_amount = null;

    expect(feeDetailModel.absEquals(feeDetailModelBlank)).toBe(true);
  });

  it('should return false is null is passed', () => {
    const model = new FeeDetailModel();
    expect(model.equals(null)).toBeFalsy();
  });

  it('should return false is null is passed', () => {
    const model = new FeeDetailModel();
    expect(model.absEquals(null)).toBeFalsy();
  });

  it('should equal', () => {
    const model = new FeeDetailModel();
    model.case_reference = '';
    model.payment_instruction_id = 0;
    model.amount = 23999;
    model.remission_amount = 11999;
    model.remission_authorisation = '';
    model.remission_benefiter = '';
    model.refund_amount = 0;
    model.fee_code = '';
    model.fee_description = '';

    const compareModel = new FeeDetailModel();
    compareModel.case_reference = '';
    compareModel.payment_instruction_id = 0;
    compareModel.amount = 23999;
    compareModel.remission_amount = 11999;
    compareModel.remission_authorisation = '';
    compareModel.remission_benefiter = '';
    compareModel.refund_amount = 0;
    compareModel.fee_code = '';
    compareModel.fee_description = '';

    expect(model.equals(compareModel)).toBeTruthy();
  });

});
