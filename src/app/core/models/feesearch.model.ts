export class FeeSearchModel {
  channel_type: { name: string };
  code: string;
  current_version?: FeeSearchVersion;
  direction_type: { name: string };
  event_type: { name: string };
  fee_type: string;
  fee_versions?: FeeSearchVersion[];
  jurisdiction1: { name: string };
  jurisdiction2: { name: string };
  memo_line: string;
  service_type: { name: string };
  statutory_instrument: string;
  unspecified_claim_amount: boolean;

  assign(data) {
    const properties = Object.keys(data);

    for (let i = 0; i < properties.length; i++) {
      if (properties[i] === 'current_version') {
        this.current_version = new FeeSearchVersion();
        this.current_version.assign(data[properties[i]]);
      } else if (properties[i] === 'fee_versions') {
        this.fee_versions = data[properties[i]].map(fee => {
          const feeSearchVersion = new FeeSearchVersion();
          feeSearchVersion.assign( fee );
          return fee;
        });
      } else {
        this[properties[i]] = data[properties[i]];
      }
    }
  }

  getAmount(): any {
    if (this.hasOwnProperty('current_version')) {
      if (this.current_version.hasOwnProperty('flat_amount') && Object.keys(this.current_version.flat_amount).length > 0) {
        return this.current_version.flat_amount.amount;
      } else if (this.current_version.hasOwnProperty('volume_amount') && Object.keys(this.current_version.volume_amount).length > 0) {
        return this.current_version.volume_amount.amount;
      }

      return 'calculate';
    }

    return 0.99;
  }
}

export class FeeSearchVersion {
  description: string;
  flat_amount?: { amount: number };
  status: string;
  version: string;
  volume_amount?: { amount: number };

  assign(data) {
    const properties = Object.keys(data);
    for (let i = 0; i < properties.length; i++) {
      if (data[properties[i]]) {
        this[properties[i]] = data[properties[i]];
      }
    }
  }
}

