import {CheckAndSubmit} from './check-and-submit';
import {PaymentInstructionModel} from './paymentinstruction.model';
import {FeeDetailModel} from './feedetail.model';
import {CaseReferenceModel} from './casereference';


describe('Test suite for check-and-submit data generation', () => {

  let checkAndSubmit: CheckAndSubmit;
  let pi: PaymentInstructionModel;
  let caseReferenceModel: CaseReferenceModel;
  let feeDetail: FeeDetailModel;

  beforeEach(() => {
    checkAndSubmit = new CheckAndSubmit();
    pi = new PaymentInstructionModel();
    pi.amount = 300;
    caseReferenceModel = new CaseReferenceModel();
    caseReferenceModel.case_reference = 'A1234';
    feeDetail = new FeeDetailModel();
    feeDetail.amount = 350;
    feeDetail.remission_amount = 50;
  });

  it('create properly formatted lines', () => {
    checkAndSubmit.convertTo(pi, caseReferenceModel, feeDetail);
    expect(checkAndSubmit.getProperty('paymentAmount')).toEqual('£300.00');
    expect(checkAndSubmit.getProperty('caseReference')).toEqual('A1234');
    expect(checkAndSubmit.getProperty('fee')).toEqual('£350.00');
  });
});
