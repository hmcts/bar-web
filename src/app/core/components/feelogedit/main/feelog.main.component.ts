import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { PaymentslogService } from '../../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../services/paymenttype/paymenttype.service';
import { FeeLogModel } from '../../../models/feelog.model';
import { ICaseFeeDetail, ICaseReference } from '../../../interfaces/payments-log';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { PaymentStatus } from '../../../models/paymentstatus.model';
import { PaymentAction } from '../../../models/paymentaction.model';
import { FeeDetailEventMessage, EditTypes } from '../detail/feedetail.event.message';

enum ActionTypes {
  PROCESS,
  SUSPENSE,
  RETURN
}

@Component({
  selector: 'app-feelog-main',
  templateUrl: './feelog.main.component.html',
  providers: [FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeelogMainComponent implements OnChanges {
  @Input() model: FeeLogModel;
  @Input() isVisible: boolean;
  @Output() onShowDetail = new EventEmitter<FeeDetailEventMessage> ();
  @Output() onReloadModel = new EventEmitter<number> ();
  @Output() onProcess = new EventEmitter<FeeLogModel>();

  selectedAction: ActionTypes;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  constructor(private feeLogService: FeelogService) {}

  getActionTypes() {
    return ActionTypes;
  }

  getEditTypes() {
    return EditTypes;
  }

  isActionDisabled(action: ActionTypes): boolean {
    if (action === ActionTypes.PROCESS) {
      return (this.checkIfRefundExists() || this.model.unallocated_amount !== 0);
    }
    if (action === ActionTypes.SUSPENSE) {
      return this.checkIfRefundExists();
    }
    if (action === ActionTypes.RETURN) {
      return !this.checkIfValidForReturn( this.model.status ) || this.checkIfRefundExists();
    }
  }

  submitAction() {
    if (this.selectedAction.toString() === ActionTypes.PROCESS.toString()) {
      this.processPayment();
    }
  }

  onChangeAction(value) {
    this.selectedAction = value;
  }

  getAllCaseFeeDetails() {
    return this.model.case_references.reduce((acc, ref) => {
      return acc.concat(ref.case_fee_details);
    }, []);
  }

  showEditButton(feeDetail: ICaseFeeDetail) {
    return feeDetail && feeDetail.status !== FeeDetailModel.STATUS_DISABLED &&
      [PaymentStatus.PENDING, PaymentStatus.VALIDATED, PaymentStatus.REJECTED, PaymentStatus.TRANSFERREDTOBAR]
      .some(it => this.model.status === it);
  }

  isTransferredToBarStatus() {
    return (this.model && this.model.status !== PaymentStatus.TRANSFERREDTOBAR);
  }

  switchToDetailComponent(type: EditTypes, feeDetail: FeeDetailModel = null) {
    const message = new FeeDetailEventMessage();
    if (!feeDetail) {
      message.feeDetail = new FeeDetailModel();
    }
    message.editType = type;
    message.feeDetail = feeDetail;
    window.scrollTo(0, 0);
    this.onShowDetail.emit(message);
  }

  removeFee(caseFeeDetail: ICaseFeeDetail) {
    this.feeLogService.removeFeeFromPaymentInstruction(caseFeeDetail)
      .then(res => this.onReloadModel.emit(this.model.id))
      .catch(err => console.log(err));
  }

  checkIfRefundExists() {
    let hasRefund = false;

    if (this.model.status !== PaymentStatus.TRANSFERREDTOBAR) {
      return hasRefund;
    }

    for (let i = 0; i < this.model.case_references.length; i++) {
      const caseReference: ICaseReference = this.model.case_references[i];
      if (caseReference.case_fee_details.find((caseFeeDetail: ICaseFeeDetail) => caseFeeDetail.refund_amount !== null)) {
        hasRefund = true;
        break;
      }
    }

    return hasRefund;
  }

  checkIfValidForReturn(paymentStatus) {
    // there must be a better way to store the label of payments
    return [PaymentStatus.PENDING, PaymentStatus.REJECTED, PaymentStatus.VALIDATED].find(status => paymentStatus === status);
  }

  processPayment() {
    this.onProcess.emit(this.model);
  }
}
