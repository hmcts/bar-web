import { FeeDetailModel } from '../../../models/feedetail.model';
import { EditTypes } from '../detail/feedetail.event.message';

export class FeeDetailEventMessasge {
    feeDetail: FeeDetailModel;
    type: EditTypes;
}
