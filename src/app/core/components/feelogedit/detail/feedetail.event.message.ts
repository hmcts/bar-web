import { ICaseFeeDetail } from '../../../interfaces/payments-log';

export enum EditTypes {
  CREATE,
  UPDATE
}

export class FeeDetailEventMessage {
  feeDetail: ICaseFeeDetail;
  originalFeeDetail: ICaseFeeDetail;
  editType: EditTypes;
}

export class UnallocatedAmountEventMessage {
  constructor(public amountDelta: number, public remissionDelta: number, public refundDelta: number) {}
}
