import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { ICaseFeeDetail } from '../../../interfaces/payments-log';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { PaymentStatus } from '../../../models/paymentstatus.model';
import { FeeDetailEventMessage, EditTypes } from '../detail/feedetail.event.message';
import { PaymentInstructionModel } from '../../../models/paymentinstruction.model';

export enum ActionTypes {
  PROCESS = 1,
  SUSPENSE = 2,
  RETURN = 3
}

@Component({
  selector: 'app-feelog-main',
  templateUrl: './feelog.main.component.html',
  providers: [FeelogService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeelogMainComponent {
  @Input() model: PaymentInstructionModel;
  @Input() isVisible: boolean;
  @Output() onShowDetail = new EventEmitter<FeeDetailEventMessage> ();
  @Output() onReloadModel = new EventEmitter<number> ();
  @Output() onProcess = new EventEmitter<PaymentInstructionModel>();
  @Output() onSuspense = new EventEmitter<any>();
  @Output() onReturn = new EventEmitter<any>();

  selectedAction: ActionTypes;
  showError = false;

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
    if (!this.selectedAction) {
      this.showError = true;
      return;
    }
    const selectedAction = <ActionTypes>this.selectedAction;
    if (selectedAction === ActionTypes.PROCESS) {
      this.processPayment();
    } else if (selectedAction === ActionTypes.SUSPENSE) {
      this.suspensePayment();
    } else if (selectedAction === ActionTypes.RETURN) {
      this.returnPayment();
    }
  }

  onChangeAction(value) {
    this.selectedAction = value;
    this.showError = false;
  }

  getAllCaseFeeDetails() {
    return this.model.case_fee_details ? this.model.case_fee_details : [];
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
    } else {
      message.feeDetail = feeDetail;
    }
    message.editType = type;
    window.scrollTo(0, 0);
    this.onShowDetail.emit(message);
  }

  removeFee(caseFeeDetail: ICaseFeeDetail) {
    this.feeLogService.removeFeeFromPaymentInstruction(caseFeeDetail)
      .then(res => this.onReloadModel.emit(this.model.id))
      .catch(err => console.log(err));
  }

  checkIfRefundExists() {
    if (this.model.status !== PaymentStatus.TRANSFERREDTOBAR) {
      return false;
    }
    return this.model.case_fee_details.some((caseFeeDetail: ICaseFeeDetail) => caseFeeDetail.refund_amount !== null);
  }

  checkIfValidForReturn(paymentStatus) {
    // there must be a better way to store the label of payments
    return [PaymentStatus.PENDING, PaymentStatus.REJECTED, PaymentStatus.VALIDATED].find(status => paymentStatus === status);
  }

  processPayment() {
    this.onProcess.emit(this.model);
  }

  suspensePayment() {
    this.onSuspense.emit();
  }

  returnPayment() {
    this.onReturn.emit();
  }
}
