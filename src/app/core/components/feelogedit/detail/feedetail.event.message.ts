import { FeeDetailModel } from '../../../models/feedetail.model';

export enum EditTypes {
  CREATE,
  UPDATE
}

export class FeeDetailEventMessage {
  feeDetail: FeeDetailModel;
  originalFeeDetail: FeeDetailModel;
  isDirty: boolean;
  editType: EditTypes;
}

export class UnallocatedAmountEventMessage {
  constructor(public amountDelta: number, public remissionDelta: number, public refundDelta: number) {}
}
