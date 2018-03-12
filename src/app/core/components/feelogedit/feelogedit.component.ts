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

  async addFeeToCase() {
    if (this.addRemissionOn && this.feeDetail.remission_amount > this.feeDetail.amount) {
      return;
    }

    const [err, data] = await UtilService.toAsync(this.feeLogService.addFeeToCase(this.loadedId, this.feeDetail));
    if (!err) {
      this.toggleFeeDetailsModal();
      this.loadPaymentInstructionById(this.model.id);
    }
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
          console.log(this.model);
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
    this.model.status = PaymentStatus.DRAFT;
    this.toggleReturnModal();
    return this.router.navigateByUrl('/feelog');
  }

  selectFee(feeCodeModel: FeeSearchModel) { this.feeDetail.assign(feeCodeModel, this.currentCaseView); }
  toggleAddRemissionBlock() { this.addRemissionOn = !this.addRemissionOn; }
  toggleCaseModalWindow() { this.modalOn = !this.modalOn; }

  toggleFeeDetailsModal(paymentInstructionCase?) {
    this.currentCaseView = paymentInstructionCase;
    if (this.feeDetailsModal) {
      this.addRemissionOn = false;
      this.feeCodes = [];
      this.searchFeeModel = '';
      this.feeDetail.reset();
    }
    this.feeDetailsModal = !this.feeDetailsModal;
  }

  toggleReturnModal() { this.returnModalOn = !this.returnModalOn; }
  toggleSuspenseModal() { this.suspenseModalOn = !this.suspenseModalOn; }

  getUnallocatedAmount() {
    let amount: number = this.model.getProperty('unallocated_amount');
    amount = amount ? amount : 0;
    const feeAmount: number = this.feeDetail.amount ? this.feeDetail.amount : 0;
    const remissionAmount: any = this.feeDetail.remission_amount ? this.feeDetail.remission_amount : 0;
    return (this.model.unallocated_amount / 100) - feeAmount + parseFloat(remissionAmount);
  }

}
