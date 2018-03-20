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

});
