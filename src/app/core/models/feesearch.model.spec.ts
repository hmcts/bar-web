import { FeeSearchModel } from './feesearch.model';

const feeSearchResultFlatAmount = JSON.parse(`
{
  "code": "X0012",
  "fee_type": "fixed",
  "channel_type": {
    "name": "default"
  },
  "direction_type": {
    "name": "enhanced"
  },
  "event_type": {
    "name": "issue"
  },
  "jurisdiction1": {
    "name": "civil"
  },
  "jurisdiction2": {
    "name": "county court"
  },
  "service_type": {
    "name": "civil money claims"
  },
  "fee_versions": [
    {
      "version": 1,
      "description": "Civil Court fees - Money Claims - Claim Amount - 200000.01 GBP or more",
      "status": "approved",
      "flat_amount": {
        "amount": 10000
      }
    }
  ],
  "current_version": {
    "version": 1,
    "description": "Civil Court fees - Money Claims - Claim Amount - 200000.01 GBP or more",
    "status": "approved",
    "flat_amount": {
      "amount": 10000
    }
  },
  "unspecified_claim_amount": true
}
`);

const feeSearchResultVolumeAmount = JSON.parse(`
{
  "code": "X0258",
  "fee_type": "fixed",
  "channel_type": {
    "name": "default"
  },
  "direction_type": {
    "name": "reduced churn"
  },
  "event_type": {
    "name": "copies"
  },
  "jurisdiction1": {
    "name": "family"
  },
  "jurisdiction2": {
    "name": "probate registry"
  },
  "service_type": {
    "name": "probate"
  },
  "fee_order_name": "Non-Contentious Probate Fees",
  "fee_versions": [
    {
      "version": 1,
      "valid_from": 1398124800511,
      "description": "Additional copies of the grant representation",
      "status": "approved",
      "volume_amount": {
        "amount": 0.5
      }
    }
  ],
  "current_version": {
    "version": 1,
    "valid_from": 1398124800511,
    "description": "Additional copies of the grant representation",
    "status": "approved",
    "volume_amount": {
      "amount": 0.5
    }
  },
  "unspecified_claim_amount": false,
  "statutory_instrument": "2014 No 876(L19)",
  "si_ref_id": "8b"
}
  `);

describe('FeeSearchModel', () => {

  it('generate FeeSearchModel from flat amount data', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultFlatAmount);
    expect(fsm.code).toBe('X0012');
    expect(fsm.current_version.description).toBe('Civil Court fees - Money Claims - Claim Amount - 200000.01 GBP or more');
    expect(fsm.current_version.flat_amount.amount).toBe(10000);
    expect(fsm.fee_versions[0].description).toBe('Civil Court fees - Money Claims - Claim Amount - 200000.01 GBP or more');
    expect(fsm.fee_versions[0].flat_amount.amount).toBe(10000);
  });

  it('generate FeeSearchModel from flat volume amount data', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultVolumeAmount);
    expect(fsm.code).toBe('X0258');
    expect(fsm.current_version.description).toBe('Additional copies of the grant representation');
    expect(fsm.current_version.volume_amount.amount).toBe(0.5);
    expect(fsm.fee_versions[0].description).toBe('Additional copies of the grant representation');
    expect(fsm.fee_versions[0].volume_amount.amount).toBe(0.5);
  });

  it('get amount when there is a flat amount', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultFlatAmount);
    expect(fsm.getAmount()).toBe(10000);
  });

  it('get amount when there is a volume amount', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultVolumeAmount);
    expect(fsm.getAmount()).toBe(0.5);
  });

  it('get amount when there is no current_version', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultFlatAmount);
    delete fsm.current_version;
    expect(fsm.getAmount()).toBe(0.99);
  });

  it('get amount when there is no amount', () => {
    const fsm = new FeeSearchModel();
    fsm.assign(feeSearchResultFlatAmount);
    delete fsm.current_version.flat_amount;
    expect(fsm.getAmount()).toBe('calculate');
  });

});
