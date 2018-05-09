import { FeeDetailModel } from '../../../models/feedetail.model';

export enum EditType {
  CREATE,
  UPDATE
}

export class FeeDetailEventMessage {
  feeDetail: FeeDetailModel;
  isDirty: boolean;
  editType: EditType;
}

export class UnallocatedAmountEventMessage {
  constructor(public amountDelta: number, public remissionDelta: number, public refundDelta: number) {}
}
