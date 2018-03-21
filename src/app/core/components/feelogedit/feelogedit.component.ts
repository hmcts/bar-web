import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FeeLogModel } from '../../models/feelog.model';
import { UserService } from '../../../shared/services/user/user.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { FeelogService } from '../../services/feelog/feelog.service';
import { UtilService } from '../../../shared/services/util/util.service';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { CaseReference } from '../../models/case-reference';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { FeeDetailModel } from '../../models/feedetail.model';
import { PaymentAction } from '../../models/paymentaction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { IResponse } from '../../interfaces/index';
import { FeeSearchModel } from '../../models/feesearch.model';
import { CaseReferenceModel } from '../../models/casereference';
import { CaseFeeDetailModel } from '../../models/casefeedetail';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { ICaseFeeDetail, ICaseReference } from '../../interfaces/payments-log';
import { orderFeeDetails } from '../../../shared/models/util/model.utils';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ['./feelogedit.component.css']
})

export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel = new FeeLogModel();
  paymentInstructionActionModel: PaymentInstructionActionModel = new PaymentInstructionActionModel();
  feeDetail: FeeDetailModel = new FeeDetailModel();
  feeDetailCopy: FeeDetailModel;
  feeCodes: FeeSearchModel[] = [];
  openedTab: number;

  caseNumberModel = '';
  searchFeeModel = '';
  currentCaseView: any = false;

  feeDetailsModal = false;
  modalOn = false;
  returnModalOn = false;
  suspenseModalOn = false;
  addRemissionOn = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private feeLogService: FeelogService,
    private location: Location,
    private paymentState: PaymentstateService) { }

  ngOnInit() {
    if (!this.userService.getUser()) {
      return this.router.navigateByUrl('/');
    }

    this.openedTab = this.paymentState.state.currentOpenedFeeTab;

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadPaymentInstructionById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async addEditFeeToCase() {
    if (this.addRemissionOn && this.feeDetail.remission_amount > this.feeDetail.amount) {
      return;
    }

    if (this.model.status === PaymentStatus.TRANSFERREDTOBAR && this.feeDetailCopy != null) {
      return this.editTransferedFee();
    }
    // check if we already have a fee_id
    let method = 'post';
    if (this.feeDetail.case_fee_id) {
      method = 'put';
    }

    if (this.addRemissionOn && this.feeDetail.remission_amount > this.feeDetail.amount) {
      return;
    }

    const [err, data] = await UtilService.toAsync(this.feeLogService.addEditFeeToCase(this.loadedId, this.feeDetail, method));
    if (!err) {
      this.toggleFeeDetailsModal();
      this.loadPaymentInstructionById(this.model.id);
    }
  }

  editTransferedFee() {
    const negatedFeeDetail = this.negateFeeDetail(this.feeDetailCopy);

    // have to set the case_id to null in both post
    negatedFeeDetail.case_fee_id = null;
    this.feeDetail.case_fee_id = null;

    this.feeLogService.addEditFeeToCase(this.loadedId, negatedFeeDetail, 'post')
      .then(() => {
        return this.feeLogService.addEditFeeToCase(this.loadedId, this.feeDetail, 'post');
      })
      .then(() => {
        this.toggleFeeDetailsModal();
        this.loadPaymentInstructionById(this.model.id);
        this.feeDetailCopy = null;
      })
      .catch(err => {
        console.error(err);
      });
  }

  negateFeeDetail(feeDetail: FeeDetailModel): FeeDetailModel {
    if (!feeDetail) {
      return null;
    }
    const negate = (amount) => amount != null ? amount * -1 : amount;
    feeDetail.amount = negate(feeDetail.amount);
    feeDetail.remission_amount = negate(feeDetail.remission_amount);
    feeDetail.refund_amount = negate(feeDetail.refund_amount);
    feeDetail.case_fee_id = null;
    return feeDetail;
  }

  async addCaseReference($ev) {
    $ev.preventDefault();

    const caseReferenceModel = new CaseReference();
    caseReferenceModel.paymentInstructionId = this.model.id;
    caseReferenceModel.caseReference = this.caseNumberModel;

    const [err, data] = await UtilService.toAsync(this.paymentLogService.createCaseNumber(caseReferenceModel));
    const response: IResponse = data;

    // display an error
    if (err) { return; }

    if (response.success) {
      this.model.case_references.push(response.data);
      this.toggleCaseModalWindow();
    }
  }

  changeTabs(tabNumber: number) {
    this.openedTab = tabNumber;
    this.paymentState.setCurrentOpenedFeeTab(this.openedTab);
  }

  loadPaymentInstructionById(feeId) {
    const p1 = this.paymentLogService.getPaymentById(feeId);
    const p2 = this.paymentLogService.getUnallocatedAmount(feeId);
    Promise.all([p1, p2])
      .then(responses => {
        if (responses[0].success && responses[1].success) {
          this.model.assign(responses[0].data);
          this.model.unallocated_amount = responses[1].data;
          this.model.case_references.forEach(reference => {
            reference.case_fee_details = orderFeeDetails(reference.case_fee_details);
          });
        } else {
          const errorMessage = responses
            .filter(resp => !resp.success)
            .map(resp => resp.data)
            .join(',');
          throw new Error(errorMessage);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  async loadFeeCodesAndDescriptions() {
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchFeeModel));
    if (err) { return; }

    if (data.found) {
      if (data.fees.length > 0) {
        this.feeCodes = data.fees.map(fee => {
          const feeSearchModel: FeeSearchModel = new FeeSearchModel();
          feeSearchModel.assign( fee );
          return feeSearchModel;
        });
      }
    }
  }

  goBack() { this.location.back(); }

  onKeyUpFeeCodesAndDescriptions($ev) {
    if ($ev.which === 13) {
      this.loadFeeCodesAndDescriptions();
    }
  }

  async onProcessPaymentSubmission() {
    this.paymentInstructionActionModel.action = PaymentAction.PROCESS;

    const [err, data] = await UtilService
      .toAsync(this.feeLogService.sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel));

    if (!err && data.success === true) {
      this.paymentInstructionActionModel = new PaymentInstructionActionModel();
      return this.router.navigateByUrl('/feelog');
    }
  }

  async onSuspenseFormSubmit($ev: Event) {
    $ev.preventDefault();

    if (this.paymentInstructionActionModel.hasOwnProperty('reason')) {
      const [err, data] = await UtilService
        .toAsync(this.feeLogService.sendPaymentInstructionAction(this.model, this.paymentInstructionActionModel));

      if (!err && data.success === true) {
        this.paymentInstructionActionModel = new PaymentInstructionActionModel();
        this.suspenseModalOn = !this.suspenseModalOn;
        this.router.navigateByUrl('/feelog');
      }
    }
  }

  returnPaymentToPostClerk() {
    this.model.status = PaymentStatus.VALIDATED;
    this.model.action = PaymentAction.RETURNS;

    this.feeLogService.updatePaymentModel(this.model).then(res => {
      this.toggleReturnModal();
      return this.router.navigateByUrl('/feelog');
    });
  }

  selectFee(feeCodeModel: FeeSearchModel) { this.feeDetail.assignFeeCase(feeCodeModel, this.currentCaseView); }
  toggleAddRemissionBlock() { this.addRemissionOn = !this.addRemissionOn; }
  toggleCaseModalWindow() { this.modalOn = !this.modalOn; }

  removeRemission() {
    this.toggleAddRemissionBlock();
    this.feeDetail.remission_amount = null;
    this.feeDetail.remission_authorisation = null;
    this.feeDetail.remission_benefiter = null;
  }

  toggleFeeDetailsModal(paymentInstructionCase?: any, feeId?: number) {
    const caseRefModel: CaseReferenceModel = paymentInstructionCase;
    this.currentCaseView = paymentInstructionCase;
    if (this.feeDetailsModal) {
      this.cleanUpWhenCloseModalDetailsModal();
    } else if (feeId) {
      this.setupDetailModal(caseRefModel, feeId);
    }
    this.feeDetailsModal = !this.feeDetailsModal;
  }

  getUnallocatedAmount(): number {
    return this.feeLogService.getUnallocatedAmount(this.model, this.feeDetail);
  }

  toggleReturnModal() { this.returnModalOn = !this.returnModalOn; }
  toggleSuspenseModal() { this.suspenseModalOn = !this.suspenseModalOn; }

  private setupDetailModal(caseRefModel: CaseReferenceModel, feeId: number) {
    this.feeDetail = Object.assign(new FeeDetailModel(),
      caseRefModel.case_fee_details.find(detail => {
        return (<CaseFeeDetailModel> detail).case_fee_id === feeId;
      }));
    this.feeDetailCopy = Object.assign(new FeeDetailModel(), this.feeDetail);
    if (this.feeDetail.remission_amount != null) {
      this.toggleAddRemissionBlock();
    }
    const [feeAmount, remissionAmount] = this.feeLogService.collectFeeAmounts(this.feeDetail);
    this.model.unallocated_amount = this.model.unallocated_amount + feeAmount * 100 - remissionAmount * 100;
  }

  private cleanUpWhenCloseModalDetailsModal() {
    const [feeAmount, remissionAmount] = this.feeDetailCopy ? this.feeLogService.collectFeeAmounts(this.feeDetailCopy) : [0, 0];
    this.model.unallocated_amount = this.model.unallocated_amount - feeAmount * 100 + remissionAmount * 100;
    this.addRemissionOn = false;
    this.feeCodes = [];
    this.searchFeeModel = '';
    this.feeDetail.reset();
    this.feeDetailCopy = null;
  }

  checkIfValidForReturn(paymentStatus) {
    // there must be a better way to store the label of payments
    return ['Pending', 'Rejected', 'Validated'].find(status => paymentStatus === status);
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
    console.log( hasRefund );
    return hasRefund;
  }

  showEditButton(feeDetail: ICaseFeeDetail) {
    return feeDetail.status !== FeeDetailModel.STATUS_DISABLED &&
      [PaymentStatus.PENDING, PaymentStatus.VALIDATED, PaymentStatus.REJECTED, PaymentStatus.TRANSFERREDTOBAR]
      .some(it => this.model.status === it);
  }
}
