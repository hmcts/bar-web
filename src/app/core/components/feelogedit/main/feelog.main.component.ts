import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
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
import { PaymentstateService } from '../../../../shared/services/state/paymentstate.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaymentAction } from '../../../interfaces/payment-actions';
import { PaymentAction } from '../../../models/paymentaction.model';


@Component({
  selector: 'app-feelog-main',
  templateUrl: './feelog.main.component.html',
  providers: [FeelogService, FeatureService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeelogMainComponent implements OnInit {

  @Input() model: PaymentInstructionModel;
  @Input() isVisible: boolean;
  @Input() actions: IPaymentAction[] = [];
  @Input() submitActionError: string;
  @Output() onShowDetail = new EventEmitter<FeeDetailEventMessage>();
  @Output() onReloadModel = new EventEmitter<number>();
  @Output() onProcess = new EventEmitter<PaymentInstructionModel>();
  @Output() onSuspense = new EventEmitter<any>();
  @Output() onReturn = new EventEmitter<any>();
  @Output() onPaymentReversion = new EventEmitter<undefined>();
  @Output() onWithdraw = new EventEmitter<any>();

  isReadOnly$: Observable<boolean>;
  selectedAction: PaymentAction;
  showError = false;
  confirmAction: { error: boolean, message: string };

  constructor(
    private feeLogService: FeelogService,
    private _featureService: FeatureService,
    private _userService: UserService,
    private _paymentStateService: PaymentstateService
  ) { }

  ngOnInit(): void {
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
    if (this.selectedAction === PaymentAction.PROCESS) {
      this.processPayment();
    } else if (this.selectedAction === PaymentAction.SUSPENSE) {
      this.suspensePayment();
    } else if (this.selectedAction === PaymentAction.RETURNS) {
      this.returnPayment();
    } else if (this.selectedAction === PaymentAction.WITHDRAW) {
      this.withdrawPayment();
    }
  }

  onChangeAction(value) {
    console.log( 'BEFORE: ' + value );
    this.selectedAction = value;
    this.showError = false;
    console.log( 'AFTER: ' + this.selectedAction );
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
    this.onProcess.emit(this.model);
  }

  suspensePayment() {
    this.onSuspense.emit();
  }

  returnPayment() {
    this.onReturn.emit();
  }

  withdrawPayment() {
    this.onWithdraw.emit();
  }

  checkIfReadOnly() {
    this.isReadOnly$ = this._featureService
      .findAllFeatures()
      .pipe(
        map((features: Feature[]) => features.find((feature: Feature) => feature.uid === 'make-editpage-readonly' && feature.enable)),
        map((feature: Feature) => isUndefined(feature) ? false : UtilService.checkIfReadOnly(this.model, this._userService.getUser()))
      );
  }

  revertPaymentInstruction() {
    this.onPaymentReversion.emit();

    // just to ensure model is changed
    this.checkIfReadOnly();
  }

  getPaymentReference(): Observable<string> {
    return this._paymentStateService.paymentTypeEnum.pipe(map(it => {
      const ref = this.model.getPaymentReference(it);
      return ref;
    }));
  }
}
