import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import {PaymentActionService} from '../../../shared/services/action/paymentaction.service';
import {FeelogService} from '../../services/feelog/feelog.service';
import {PaymentInstructionActionModel} from '../../models/payment-instruction-action.model';
import {FeeDetailModel} from '../../models/feedetail.model';
import {PaymentAction} from '../../models/paymentaction.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {UserService} from '../../../shared/services/user/user.service';
import {ICaseFeeDetail} from '../../interfaces/payments-log';
import {IPaymentAction} from '../../interfaces/payment-actions';
import {UtilService} from '../../../shared/services/util/util.service';
import {EditTypes, FeeDetailEventMessage, UnallocatedAmountEventMessage} from './detail/feedetail.event.message';
import * as _ from 'lodash';
import {isUndefined} from 'lodash';
import {map, pluck} from 'rxjs/operators';
import {IResponse} from '../../interfaces';
import {Observable} from 'rxjs';
import {PaymentType} from '../../../shared/models/util/model.utils';
import {PaymentTypeModel} from '../../models/paymenttype.model';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [PaymentActionService, FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ['./feelogedit.component.scss']
})
export class FeelogeditComponent implements OnInit {
  feeDetail: ICaseFeeDetail = new FeeDetailModel();
  loadedId: string;
  submitActionError: string;
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentInstructionActionModel: PaymentInstructionActionModel = new PaymentInstructionActionModel();

  refundModalOn = false;
  suspenseModalOn = false;

  mainComponentOn = true;
  feeDetailsComponentOn = false;
  delta = new UnallocatedAmountEventMessage(0, 0, 0);
  detailPageType = EditTypes.CREATE;
  jurisdictions = this.createEmptyJurisdiction();
  isReadOnly = true;

  model$: Observable<PaymentInstructionModel>;
  paymentActions$: Observable<IPaymentAction[]>;
  unallocatedAmount$: Observable<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentLogService: PaymentslogService,
    private feeLogService: FeelogService,
    private location: Location,
    private paymentActionService: PaymentActionService,
    private _userService: UserService,
  ) {
    this.model.payment_type = { name: '' };
  }

  ngOnInit() {
    const hash = window.location.hash;
    window.location.hash = '';
    // collect all the necessary properties (from resolve)
    this.route.data.pipe(pluck('paymentInstructionData'))
      .subscribe((paymentInstructionData: IResponse[]) => {
        const [paymentInstruction, unallocatedAmount, features] = paymentInstructionData;
        const isReadOnly = features.data.find(readOnly => readOnly.uid === 'make-editpage-readonly' && readOnly.enable);

        this.model.assign(paymentInstruction.data);
        this.model.unallocated_amount = unallocatedAmount.data;
        this.delta = new UnallocatedAmountEventMessage(0, 0, 0);
        this.isReadOnly = isUndefined(isReadOnly)
          ? false
          : UtilService.checkIfReadOnly(this.model, this._userService.getUser());
          this.paymentActions$ = this.paymentActionService
            .getPaymentActions()
            .pipe(map((data: IResponse) => data.data))
            .pipe(map(actions => this.filterActionsBasedType(this.model.payment_type, actions)));
     });

    this.loadFeeJurisdictions();
    if (hash === '#fees') {
      const event = new FeeDetailEventMessage();
      event.editType = EditTypes.CREATE;
      event.feeDetail = new FeeDetailModel();
      this.makeDetailsVisible(event);
    }
  }

  createEmptyJurisdiction() {
    return {
      list1: {
        show: false,
        data: []
      },
      list2: {
        show: false,
        data: []
      }
    };
  }

  addEditFeeToCase(message: FeeDetailEventMessage): Promise<any> {
    this.closeDetails();
    if (message.feeDetail == null || message.feeDetail.equals(message.originalFeeDetail)) {
      return;
    }
    if (message.feeDetail.remission_amount > message.feeDetail.amount) {
      throw new Error('Remission amount is bigger then the fee amount');
    }

    if (
      this.model.status === PaymentStatus.TRANSFERREDTOBAR &&
      message.editType === EditTypes.UPDATE
    ) {
      return this.editTransferedFee(message.feeDetail, message.originalFeeDetail);
    }
    // check if we already have a fee_id
    let method = 'post';
    if (message.feeDetail.case_fee_id) {
      method = 'put';
    }

    message.feeDetail.payment_instruction_id = this.model.id;
    return this.feeLogService
      .addEditFeeToCase(this.model.id.toString(), message.feeDetail, method)
      .then(() => {
        return this.loadPaymentInstructionById(this.model.id);
      })
      .catch(error => {
        console.error(error);
      });
  }

  editTransferedFee(feeDetail: ICaseFeeDetail, originalFeeDetail: ICaseFeeDetail): Promise<any> {
    const negatedFeeDetail = this.negateFeeDetail(originalFeeDetail);

    // have to set the case_id to null in both post
    negatedFeeDetail.case_fee_id = null;
    this.feeDetail.case_fee_id = null;

    return this.feeLogService
      .addEditFeeToCase(this.model.id.toString(), negatedFeeDetail, 'post')
      .then(() => this.feeLogService.addEditFeeToCase(this.loadedId, feeDetail, 'post'))
      .then(() => this.loadPaymentInstructionById(this.model.id))
      .catch(err => console.error(err));
  }

  negateFeeDetail(feeDetail: ICaseFeeDetail): ICaseFeeDetail {
    if (!feeDetail) {
      return null;
    }
    const negatedFeeDetail = _.clone(feeDetail);
    const negate = amount => (amount ? amount * -1 : amount);
    negatedFeeDetail.amount = negate(feeDetail.amount);
    negatedFeeDetail.remission_amount = negate(feeDetail.remission_amount);
    negatedFeeDetail.refund_amount = negate(feeDetail.refund_amount);
    negatedFeeDetail.case_fee_id = null;
    return negatedFeeDetail;
  }

  loadPaymentInstructionById(feeId) {
    const p1 = this.paymentLogService.getPaymentById(feeId);
    const p2 = this.paymentLogService.getUnallocatedAmount(feeId);
    Promise.all([p1, p2])
      .then((responses: IResponse[]) => {
        const [paymentInstructionModelResponse, unallocatedAmountResponse] = responses;
        if (paymentInstructionModelResponse.success && unallocatedAmountResponse.success) {
          this.delta = new UnallocatedAmountEventMessage(0, 0, 0);
          this.model.assign(paymentInstructionModelResponse.data);
          this.model.unallocated_amount = unallocatedAmountResponse.data;
        } else {
          const errorMessage = responses
            .filter(resp => !resp.success)
            .map(resp => resp.data)
            .join(',');
          throw new Error(errorMessage);
        }
      })
      .catch(err => console.error(err));
  }

  async loadFeeJurisdictions() {
    this.jurisdictions = this.createEmptyJurisdiction();
    const [err1, data1] = await UtilService.toAsync(this.feeLogService.getFeeJurisdictions('1'));
    if (err1) {
      console.log('Cannot perform fetch', err1);
      return;
    }

    if (data1.found) {
      data1.jurisdictions.map(jurisdiction => {
        this.jurisdictions.list1.data.push(jurisdiction.name);
      });
    }

    const [err2, data2] = await UtilService.toAsync(this.feeLogService.getFeeJurisdictions('2'));
    if (err2) {
      console.log('Cannot perform fetch', err2);
      return;
    }

    if (data2.found) {
      data2.jurisdictions.map(jurisdiction => {
        this.jurisdictions.list2.data.push(jurisdiction.name);
      });
    }
  }

  goBack() {
    this.location.back();
    if (!this.mainComponentOn) {
      this.mainComponentOn = true;
    }
  }

  onRefund() {
    this.paymentInstructionActionModel.action = PaymentAction.REFUNDED;
    this.feeLogService
      .sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel)
      .then(() => {
        this.paymentInstructionActionModel = new PaymentInstructionActionModel();
        return this.router.navigateByUrl('/feelog');
      })
      .catch(err => {
        this.submitActionError = err.error.message;
        console.log( this.submitActionError );
      });
  }

  onProcessPaymentSubmission(model: PaymentInstructionModel) {
    this.paymentInstructionActionModel.action = PaymentAction.PROCESS;
    this.feeLogService
      .sendPaymentInstructionAction(model, this.paymentInstructionActionModel)
      .then(() => {
        this.paymentInstructionActionModel = new PaymentInstructionActionModel();
        return this.router.navigateByUrl('/feelog');
      })
      .catch(err => {
        this.submitActionError = err.error.message;
        console.log( this.submitActionError );
      });
  }

  onSuspenseFormSubmit(e) {
    e.preventDefault();
    if (!isUndefined(this.paymentInstructionActionModel.action_reason)) {
      this.feeLogService
        .sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel)
        .then(() => {
          this.paymentInstructionActionModel = new PaymentInstructionActionModel();
          this.suspenseModalOn = !this.suspenseModalOn;
          return this.router.navigateByUrl('/feelog');
        })
        .catch(err => console.log(err));
    }
  }

  onWithdrawPaymentSubmission(): void {
    this.paymentInstructionActionModel.action = PaymentAction.WITHDRAW;
    this.paymentInstructionActionModel.action_reason = this.model.action_reason;
    if (this.model.action_comment) {
      this.paymentInstructionActionModel.action_comment = this.model.action_comment;
    }

    this.feeLogService
      .sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel)
      .then(() => this.router.navigateByUrl('/feelog'))
      .catch(err => {
        console.log(err);
        this.submitActionError = err.error.message;
      });
  }

  returnPaymentToPostClerk() {
    this.paymentInstructionActionModel.action = PaymentAction.RETURNS;
    this.paymentInstructionActionModel.action_reason = this.model.action_reason;
    if (this.model.action_comment) {
      this.paymentInstructionActionModel.action_comment = this.model.action_comment;
    }

    this.feeLogService
      .sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel)
      .then(() => this.router.navigateByUrl('/feelog'))
      .catch(err => {
        console.log(err);
        this.submitActionError = err.error.message;
      });
  }

  getUnallocatedAmount(): number {
    if (this.model.payment_type.id === PaymentType.FULL_REMISSION) {
      return 0;
    } else {
      return (
        this.model.unallocated_amount -
        this.delta.amountDelta * 100 +
        this.delta.remissionDelta * 100 -
        this.delta.refundDelta * 100
      );
    }
  }

  toggleRefundModal() {
    this.refundModalOn = !this.refundModalOn;
  }

  toggleSuspenseModal() {
    this.suspenseModalOn = !this.suspenseModalOn;
  }

  changeStatusToRefund() {
    this.model.action = PaymentAction.REFUNDED;
    this.model.status = PaymentStatus.VALIDATED;
    this.feeLogService.updatePaymentModel(this.model).then(res => {
      return this.router.navigateByUrl('/feelog');
    });
  }

  isRefundEnabled(): boolean {
    return this.model.status === PaymentStatus.TRANSFERREDTOBAR;
  }

  makeDetailsVisible(feeDetailEventMessage: FeeDetailEventMessage) {
    this.feeDetail = _.cloneDeep(feeDetailEventMessage.feeDetail);
    this.detailPageType = feeDetailEventMessage.editType;
    this.mainComponentOn = false;
    this.feeDetailsComponentOn = true;
    window.location.hash = this.detailPageType === EditTypes.CREATE ? 'fees' : `fees/${this.feeDetail.case_fee_id}`;
  }

  closeDetails() {
    this.mainComponentOn = true;
    this.feeDetailsComponentOn = false;
    const l = this.location;
    this.location.replaceState(l.path(false));
  }

  updateUnallocatedAmount(delta: UnallocatedAmountEventMessage) {
    this.delta = delta;
  }

  collectCaseReferences(): Array<String> {
    return this.model.case_fee_details
      ? _.uniq(this.model.case_fee_details.map(it => it.case_reference))
      : [];
  }

  onFeeDetailCancel() {
    this.closeDetails();
  }

  onPaymentReversion(e: undefined) {
    const paymentInstructionModel: PaymentInstructionModel = _.clone(this.model);
    if (paymentInstructionModel.status === PaymentStatus.getPayment('Draft').code) {
      paymentInstructionModel.action = PaymentAction.PROCESS;
    } else {
      paymentInstructionModel.status = PaymentStatus.getPayment('Pending').code;
    }

    this.feeLogService
      .updatePaymentModel(paymentInstructionModel)
      .then(() => {this.model = paymentInstructionModel;
        paymentInstructionModel.status = PaymentStatus.getPayment('Pending').code;
      })
      .catch(console.log);
  }

  onReturnPayment(): void {
    this.returnPaymentToPostClerk();
  }

  onSuspenseDeficiency(): void {
    this.paymentInstructionActionModel.action = PaymentAction.SUSPENSEDEFICIENCY;
    this.paymentInstructionActionModel.action_reason = this.model.action_reason;
    if (this.model.action_comment) {
      this.paymentInstructionActionModel.action_comment = this.model.action_comment;
    }

    this.feeLogService
      .sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel)
      .then(() => this.router.navigateByUrl('/feelog'))
      .catch(err => this.submitActionError = err.error.message);
  }

  onSuspensePayment(): void {
    this.suspenseModalOn = true;
  }

  onWithdrawPayment(): void {
    this.model.action = PaymentAction.WITHDRAW;
    this.model.status = PaymentStatus.PENDINGAPPROVAL;
    this.feeLogService.updatePaymentModel(this.model)
      .then(res => this.router.navigateByUrl('/feelog'));
  }

  filterActionsBasedType(model: PaymentTypeModel, actions: IPaymentAction[]): IPaymentAction[] {
    if (model.id !== PaymentType.FULL_REMISSION) {
      return actions;
    } else {
      return actions.filter(action => {
        return [PaymentAction.PROCESS, PaymentAction.RETURNS, PaymentAction.WITHDRAW].includes(action.action);
      });
    }
  }
}
