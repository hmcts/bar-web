export class FeeSearchModel {
  code: string;
  fee_type: string;
  channel_type: { name: string };
  direction_type: { name: string };
  event_type: { name: string };
  jurisdiction1: { name: string };
  jurisdiction2: { name: string };
  service_type: { name: string };
  fee_versions?: FeeSearchVersion[];
  current_version?: FeeSearchVersion;
  unspecified_claim_amount: boolean;

  getAmount(): number {
    if (this.hasOwnProperty('current_version')) {
      if (this.current_version.hasOwnProperty('flat_amount') && Object.keys(this.current_version.flat_amount).length > 0) {
        return this.current_version.flat_amount.amount;
      } else if (this.current_version.hasOwnProperty('volume_amount') && Object.keys(this.current_version.volume_amount).length > 0) {
        return this.current_version.volume_amount.amount;
      }

      return 0.99;
    }

    return 0.99;
  }
}

export class FeeSearchVersion {
  description: string;
  flat_amount: { amount: number };
  status: string;
  version: string;
  volume_amount: { amount: number };
}

