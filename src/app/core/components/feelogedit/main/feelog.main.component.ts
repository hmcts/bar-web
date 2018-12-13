import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { ICaseFeeDetail } from '../../../interfaces/payments-log';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { PaymentStatus } from '../../../models/paymentstatus.model';
import {
  FeeDetailEventMessage,
  EditTypes
} from '../detail/feedetail.event.message';
import { PaymentInstructionModel } from '../../../models/paymentinstruction.model';
import { UtilService } from '../../../../shared/services/util/util.service';
import { isUndefined } from 'lodash';
import { FeatureService } from '../../../../shared/services/feature/feature.service';
import Feature from '../../../../shared/models/feature.model';
import { UserService } from '../../../../shared/services/user/user.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaymentAction } from '../../../interfaces/payment-actions';
import { PaymentAction } from '../../../models/paymentaction.model';
import {WithdrawReasonModel, IWithdrawReason} from '../../../models/withdrawreason.model';
import { ReturnReasonModel, IReturnReason } from '../../../models/returnreason.model';
import { PaymentInstructionsService } from '../../../services/payment-instructions/payment-instructions.service';
import { PaymentType } from '../../../../shared/models/util/model.utils';
import { CaseFeeDetailModel } from '../../../models/casefeedetail';


@Component({
  selector: 'app-feelog-main',
  templateUrl: './feelog.main.component.html',
  providers: [FeelogService, FeatureService, PaymentInstructionsService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeelogMainComponent implements OnChanges, OnInit {

  @Input() model: PaymentInstructionModel;
  @Input() isVisible: boolean;
  @Input() actions: IPaymentAction[] = [];
  @Input() submitActionError: string;
  @Input() isReadOnly: boolean;
  @Output() onShowDetail = new EventEmitter<FeeDetailEventMessage>();
  @Output() onReloadModel = new EventEmitter<number>();
  @Output() onProcess = new EventEmitter<PaymentInstructionModel>();
  @Output() onSuspense = new EventEmitter<any>();
  @Output() onRefund = new EventEmitter<void>();
  @Output() onReturn = new EventEmitter<any>();
  @Output() onPaymentReversion = new EventEmitter<undefined>();
  @Output() onWithDraw = new EventEmitter<PaymentInstructionModel>();
  @Output() onSuspenseDeficiency = new EventEmitter<void>();

  isReadOnly$: Observable<boolean>;
  selectedAction: IPaymentAction;
  showError = false;
  confirmAction: { error: boolean, message: string };
  showWithdrawTextArea = false;
  showReturnTextArea = false;
  withdrawReasons = new WithdrawReasonModel();
  returnReasons = new ReturnReasonModel();

  constructor(
    private feeLogService: FeelogService,
    private _featureService: FeatureService,
    private _userService: UserService,
    public paymentInstructionService: PaymentInstructionsService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model) {
      this.model = changes.model.currentValue;
      this.checkIfReadOnly();
    }
  }

  ngOnInit() {
    this.checkIfReadOnly();
  }

  get paymentStatus() {
    return PaymentStatus;
  }

  getActionTypes() {
    return PaymentAction;
  }

  getEditTypes() {
    return EditTypes;
  }
  /*
  isActionDisabled(action: PaymentAction): boolean {
    if (action === PaymentAction.PROCESS) {
      return this.checkIfRefundExists() || this.model.unallocated_amount !== 0;
    }
    if (action === PaymentAction.SUSPENSE) {
      return this.checkIfRefundExists();
    }
    if (action === PaymentAction.RETURNS) {
      return (
        !this.checkIfValidForReturn(this.model.status) ||
        this.checkIfRefundExists()
      );
    }
  }
  */
  submitAction() {
    if (!this.selectedAction) {
      this.showError = true;
      return;
    }
    if (this.selectedAction.action === PaymentAction.PROCESS) {
      this.processPayment();
    } else if (this.selectedAction.action === PaymentAction.SUSPENSE) {
      this.suspensePayment();
    } else if (this.selectedAction.action === PaymentAction.RETURNS) {
      this.returnPayment();
    } else if (this.selectedAction.action === PaymentAction.WITHDRAW) {
      this.withdrawPayment();
    } else if (this.selectedAction.action === PaymentAction.SUSPENSEDEFICIENCY) {
      this.suspenseDeficiencyPayment();
    } else if (this.selectedAction.action === PaymentAction.REFUNDED) {
      this.refundPayment();
    }
  }

  getAllCaseFeeDetails() {
    return this.model.case_fee_details ? this.model.case_fee_details : [];
  }

  showEditButton(feeDetail: ICaseFeeDetail) {
    return (
      feeDetail &&
      feeDetail.status !== FeeDetailModel.STATUS_DISABLED &&
      [
        PaymentStatus.PENDING,
        PaymentStatus.VALIDATED,
        PaymentStatus.REJECTED,
        PaymentStatus.TRANSFERREDTOBAR
      ].some(it => this.model.status === it)
    );
  }

  isTransferredToBarStatus() {
    return this.model && this.model.status !== PaymentStatus.TRANSFERREDTOBAR;
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
    this.feeLogService
      .removeFeeFromPaymentInstruction(caseFeeDetail)
      .then(res => this.onReloadModel.emit(this.model.id))
      .catch(err => console.log(err));
  }

  checkIfRefundExists() {
    if (this.model.status !== PaymentStatus.TRANSFERREDTOBAR) {
      return false;
    }
    return this.model.case_fee_details.some(
      (caseFeeDetail: ICaseFeeDetail) => caseFeeDetail.refund_amount !== null
    );
  }

  checkIfValidForReturn(paymentStatus) {
    // there must be a better way to store the label of payments
    return [
      PaymentStatus.PENDING,
      PaymentStatus.REJECTED,
      PaymentStatus.VALIDATED
    ].find(status => paymentStatus === status);
  }

  processPayment() {
    if (!this.validatePayment(PaymentAction.PROCESS)) {
      return;
    }
    this.onProcess.emit(this.model);
  }

  refundPayment() {
    this.onRefund.emit();
  }

  returnPayment() {
    this.onReturn.emit();
  }

  suspenseDeficiencyPayment() {
    this.onSuspenseDeficiency.emit();
  }

  suspensePayment() {
    this.onSuspense.emit();
  }

  withdrawPayment() {
    this.onWithDraw.emit();
  }

  checkIfReadOnly() {
    this.isReadOnly$ = this._featureService.findAllFeatures()
      .pipe(
        map((features: Feature[]) => features.find((feature: Feature) => feature.uid === 'make-editpage-readonly' && feature.enable)),
        map((feature: Feature) => isUndefined(feature) ? false : UtilService.checkIfReadOnly(this.model, this._userService.getUser()))
      );
      this.isReadOnly$.subscribe(isReadonly => this.isReadOnly = isReadonly);
  }

  revertPaymentInstruction() {
    this.onPaymentReversion.emit();
  }

  getReturnReason(reasonId: number): string {
    const reason = this.returnReasons.reasons.find((model: IReturnReason) => model.id === reasonId);
    return (isUndefined(reason)) ? '' : reason.reason;
  }

  getWithdrawReason(withdrawId: number): string {
    const withdraw = this.withdrawReasons.reasons.find((model: IWithdrawReason) => model.id === withdrawId);
    return (isUndefined(withdraw)) ? '' : withdraw.reason;
  }

  // Events go here ---------------------- ---------------------- ----------------------

  onChangeAction(paymentAction: IPaymentAction) {
    this.selectedAction = paymentAction;
    this.showError = false;
  }

  onToggleReason(value: string) {
    const valueInt = parseInt(value, 10);
    this.showWithdrawTextArea = this.withdrawReasons
      .getReasonById(valueInt).id === 3;
    this.showReturnTextArea = this.returnReasons
      .getReasonById(valueInt).id === 3;
  }

  validatePayment(action: string) {
    let isValid = true;
    if (action === PaymentAction.PROCESS && this.model.payment_type.id === PaymentType.FULL_REMISSION) {
      if (this.model.case_fee_details.length !== 1) {
        this.submitActionError = 'Full Remission must have one and only one fee';
        isValid = false;
      }
    }
    return isValid;
  }

  displayRemission(feeDetail: CaseFeeDetailModel) {
    if (this.model.payment_type.id === PaymentType.FULL_REMISSION) {
      return feeDetail.amount;
    } else {
      return feeDetail.remission_amount;
    }
  }
}
