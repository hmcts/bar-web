import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { FeelogService } from '../../services/feelog/feelog.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentstateService } from '../../state/paymentstate.service';
import { CaseReference } from '../../models/case-reference';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { FeeDetailModel } from '../../models/feedetail.model';
import { PaymentAction } from '../../models/paymentaction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';

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

  caseNumberModel = '';
  openedTab = this.paymentState.state.currentOpenedFeeTab;
  feeCodes: {}[] = [];
  selectedFee: any = false;
  feeDescription = '';
  feeAmount = 0.00;
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

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadFeeById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async addFeeToCase() {
    if (this.addRemissionOn && this.feeDetail.remission_amount > this.feeDetail.amount) {
      // remission amount should never be more than amount
      return;
    }

    if (this.feeDetail.remission_amount > 0) {
      this.feeDetail.remission_amount = (this.feeDetail.remission_amount * 100);
    }

    this.feeDetail.amount = (this.feeDetail.amount * 100);

    const [err, data] = await UtilService.toAsync(this.feeLogService.addFeeToCase(this.loadedId, this.feeDetail));
    if (!err) {
      this.toggleFeeDetailsModal();
      this.loadFeeById(this.model.id);
    }
  }

  async addCaseReference($event) {
    $event.preventDefault();
    try {
      const caseReferenceModel = new CaseReference();
      caseReferenceModel.paymentInstructionId = this.model.id;
      caseReferenceModel.caseReference = this.caseNumberModel;

      const createCaseNumber = await this.paymentLogService.createCaseNumber(caseReferenceModel);
      if (createCaseNumber.success === true) {
        this.model.case_references.push(createCaseNumber.data);
        this.toggleCaseModalWindow();
      }
    } catch (exception) {
      console.log( exception );
    }
  }

  changeTabs(tabNumber: number) {
    this.openedTab = tabNumber;

    // set the state of the opened tab - for other shared components etc
    this.paymentState.setCurrentOpenedFeeTab(this.openedTab);
  }

  async loadFeeById(feeId) {
    try {
      const request = await this.paymentLogService.getPaymentById(feeId);
      if (request.success === true) {
        this.model = request.data;
      }
    } catch (e) {
      console.log( e );
    }
  }

  async loadFeeCodesAndDescriptions() {
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchFeeModel));
    if (!err) {
      if (data.found) {
        this.feeCodes = data.fees;
      }
    }
  }

  getAmount(feeDetail: FeeDetailModel) { return `£${(feeDetail.amount / 100).toFixed(2)}`; }

  getFeeAmount(feeCode): number {
    if (feeCode.hasOwnProperty('current_version')) {
      if (feeCode.current_version.hasOwnProperty('flat_amount') && Object.keys(feeCode.current_version.flat_amount).length > 0) {
        return feeCode.current_version.flat_amount.amount.toFixed(2);
      } else if (feeCode.current_version.hasOwnProperty('volume_amount') && Object.keys(feeCode.current_version.volume_amount).length > 0) {
        return feeCode.current_version.volume_amount.amount.toFixed(2);
      }

      return 0.99;
    }

    return 0.99;
  }

  getRemissionAmount(feeDetail: FeeDetailModel): string {
    if (!feeDetail.hasOwnProperty('remission_amount') || feeDetail.remission_amount === null) {
      return '-';
    }

    return `£${(feeDetail.remission_amount / 100).toFixed(2)}`;
  }

  goBack() { this.location.back(); }

  onKeyUpFeeCodesAndDescriptions($ev) {
    if ($ev.which === 13) { this.loadFeeCodesAndDescriptions(); }
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

  async onSuspenseFormSubmit($event: Event) {
    $event.preventDefault();

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

  selectFee(feeCodeModel) {
    this.feeDetail.amount = this.getFeeAmount(feeCodeModel);
    this.feeDetail.case_reference = this.currentCaseView.id;
    this.feeDetail.case_reference_id = this.currentCaseView.id; // why this is here? i don't know (if we already have case_reference)
    this.feeDetail.fee_code = feeCodeModel.code;
    this.feeDetail.fee_description = feeCodeModel.current_version.description;
    this.feeDetail.fee_version = feeCodeModel.current_version.version;
  }

  toggleAddRemissionBlock() { this.addRemissionOn = !this.addRemissionOn; }

  toggleCaseModalWindow() { this.modalOn = !this.modalOn; }

  toggleFeeDetailsModal(paymentInstructionCase?) {
    this.currentCaseView = paymentInstructionCase;

    if (this.feeDetailsModal) {
      this.feeCodes = [];
      this.searchFeeModel = '';
      this.feeDetail.amount = null;

      this.feeDetail.fee_code = '';
      this.feeDetail.fee_description = '';
      this.feeDetail.fee_version = '';

      this.feeDetail.remission_amount = null;
      this.feeDetail.remission_benefiter = '';
      this.feeDetail.remission_authorisation = '';
      this.addRemissionOn = false;
    }

    this.feeDetailsModal = !this.feeDetailsModal;
  }

  toggleReturnModal() { this.returnModalOn = !this.returnModalOn; }

  toggleSuspenseModal() { this.suspenseModalOn = !this.suspenseModalOn; }

}
