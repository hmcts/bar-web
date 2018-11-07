import { ReturnReasonModel } from './returnreason.model';

describe('Return Reason Test', () => {
  let returnReasonModel;

  beforeEach(() => {
    returnReasonModel = new ReturnReasonModel();
  });

  it('should have loaded okay.', () => {
    expect(returnReasonModel).toBeTruthy();
  });

  it('should give me the right reason.', () => {
    expect(returnReasonModel.getReasonById(2)).toBeTruthy();
  });

  it('should return "undefined".', () => {
    expect(returnReasonModel.getReasonById(12)).toBeUndefined();
  });

  afterEach(() => {
    returnReasonModel = null;
  });

});
