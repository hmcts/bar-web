import {CheckAndSubmit} from './check-and-submit';
import {PaymentInstructionModel} from './paymentinstruction.model';
import {FeeDetailModel} from './feedetail.model';
import { PaymentStatus } from './paymentstatus.model';
import { PaymentAction } from './paymentaction.model';


describe('Test suite for check-and-submit data generation', () => {

  let checkAndSubmit: CheckAndSubmit;
  let pi: PaymentInstructionModel;
  let feeDetail: FeeDetailModel;

  beforeEach(() => {
    checkAndSubmit = new CheckAndSubmit();
    pi = new PaymentInstructionModel();
    pi.amount = 300;
    feeDetail = new FeeDetailModel();
    feeDetail.amount = 350;
    feeDetail.remission_amount = 50;
    feeDetail.case_reference = 'A1234';
  });

  it('create properly formatted lines', () => {
    checkAndSubmit.convertTo(pi, feeDetail);
    expect(checkAndSubmit.getProperty('paymentAmount')).toEqual('£300.00');
    expect(checkAndSubmit.getProperty('caseReference')).toEqual('A1234');
    expect(checkAndSubmit.getProperty('fee')).toEqual('£350.00');
  });

  it('Should ensure that it returns the correct property value.', () => {
    const paymentId = 12;
    checkAndSubmit.paymentId = paymentId;
    expect(checkAndSubmit.getProperty('paymentId')).toEqual(paymentId);
  });

  it('Should ensure that the necessary properties have successfully been removed.', () => {
    checkAndSubmit.paymentId = 12;
    checkAndSubmit.date = '2018-03-19';
    checkAndSubmit.name = 'James Reece-Carter';
    checkAndSubmit.paymentType = { id: 'cash', name: 'Cash' };
    checkAndSubmit.paymentAmount = 99.99;
    checkAndSubmit.status = PaymentStatus.DRAFT;
    checkAndSubmit.action = PaymentAction.PROCESS;

    checkAndSubmit.removeDuplicateProperties();
    expect(checkAndSubmit.paymentId).toEqual(null);
    expect(checkAndSubmit.date).toEqual(null);
    expect(checkAndSubmit.name).toEqual(null);
    expect(checkAndSubmit.paymentType).toEqual(null);
    expect(checkAndSubmit.paymentAmount).toEqual(null);
    expect(checkAndSubmit.status).toEqual('');
    expect(checkAndSubmit.action).toEqual('');
  });

});
