import { CaseReferenceModel } from './casereference';
import { CaseFeeDetailModel } from './casefeedetail';

describe('Test suite for casereference.', () => {

  let caseReference: CaseReferenceModel;

  beforeEach(() => {
    caseReference = new CaseReferenceModel();
  });

  it('Should create a new case reference model', () => {
    expect(caseReference).toBeTruthy();
  });

  it('Should return the data I have inserted.', () => {
    const caseFeeDetail = new CaseFeeDetailModel();
    caseFeeDetail.amount = 99.99;
    caseFeeDetail.case_fee_id = 1;
    caseFeeDetail.case_reference = '';
    caseFeeDetail.case_reference_id = 1;
    caseFeeDetail.fee_code = 'EXP4NY0';
    caseFeeDetail.fee_description = 'Something random.';
    caseFeeDetail.fee_version = 'v0.0.1';

    const data = {
      id: 1,
      payment_instruction_id: 74,
      case_fee_details: [],
      case_reference: ''
    };

    data.case_fee_details.push(caseFeeDetail);
    caseReference.assign(data);

    expect(caseReference.id).toEqual(data.id);
    expect(caseReference.payment_instruction_id).toEqual(data.payment_instruction_id);
    expect(caseReference.case_fee_details).toEqual(data.case_fee_details);
    expect(caseReference.case_reference).toEqual(data.case_reference);
    expect(caseReference.case_fee_details.length).toEqual(data.case_fee_details.length);
  });

  it('Should ensure that the case fee details has nothing.', () => {
    const data = {
      id: 1,
      payment_instruction_id: 74,
      case_fee_details: [],
      case_reference: ''
    };

    caseReference.assign(data);

    expect(caseReference.id).toEqual(data.id);
    expect(caseReference.payment_instruction_id).toEqual(data.payment_instruction_id);
    expect(caseReference.case_fee_details).toEqual(data.case_fee_details);
    expect(caseReference.case_reference).toEqual(data.case_reference);
    expect(caseReference.case_fee_details.length).toEqual(data.case_fee_details.length);
  });

});
