import { WithdrawReasonModel } from './withdrawreason.model';

describe('Withdraw Reason Test', () => {
  let withdrawReasonModel;

  beforeEach(() => {
    withdrawReasonModel = new WithdrawReasonModel();
  });

  it('should have loaded okay.', () => {
    expect(withdrawReasonModel).toBeTruthy();
  });

  it('should give me the right reason.', () => {
    expect(withdrawReasonModel.getReasonById(2)).toBeTruthy();
  });

  it('should return "undefined".', () => {
    expect(withdrawReasonModel.getReasonById(12)).toBeUndefined();
  });

  afterEach(() => {
    withdrawReasonModel = null;
  });

});
