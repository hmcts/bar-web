import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { PaymentslogService } from "../../services/paymentslog/paymentslog.service";
import { PaymenttypeService } from "../../services/paymenttype/paymenttype.service";
import { FeelogService } from "../../services/feelog/feelog.service";
import { PaymentInstructionActionModel } from "../../models/payment-instruction-action.model";
import { FeeDetailModel } from "../../models/feedetail.model";
import { PaymentAction } from "../../models/paymentaction.model";
import { PaymentStatus } from "../../models/paymentstatus.model";
import { PaymentInstructionModel } from "../../models/paymentinstruction.model";
import { ICaseFeeDetail } from "../../interfaces/payments-log";
import {
  FeeDetailEventMessage,
  EditTypes,
  UnallocatedAmountEventMessage
} from "./detail/feedetail.event.message";
import * as _ from "lodash";

@Component({
  selector: "app-feelogedit",
  templateUrl: "./feelogedit.component.html",
  providers: [FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ["./feelogedit.component.scss"]
})
export class FeelogeditComponent implements OnInit {
  feeDetail: ICaseFeeDetail = new FeeDetailModel();
  loadedId: string;
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentInstructionActionModel: PaymentInstructionActionModel = new PaymentInstructionActionModel();

  refundModalOn = false;
  returnModalOn = false;
  suspenseModalOn = false;

  mainComponentOn = true;
  feeDetailsComponentOn = false;
  delta = new UnallocatedAmountEventMessage(0, 0, 0);
  detailPageType = EditTypes.CREATE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentLogService: PaymentslogService,
    private feeLogService: FeelogService,
    private location: Location
  ) {
    this.model.payment_type = { name: "" };
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.onRouteParams(params));
  }

  onRouteParams(params) {
    if (typeof params.id !== "undefined") {
      this.loadedId = params.id;
      if (/[0-9]/.test(this.loadedId)) {
        this.loadPaymentInstructionById(this.loadedId);
      } else {
        return this.router.navigateByUrl("/paymentslog");
      }
    }
  }

  addEditFeeToCase(message: FeeDetailEventMessage): Promise<any> {
    this.closeDetails();
    if (message.feeDetail.equals(message.originalFeeDetail)) {
      return;
    }
    if (message.feeDetail.remission_amount > message.feeDetail.amount) {
      throw new Error("Remission amount is bigger then the fee amount");
    }

    if (
      this.model.status === PaymentStatus.TRANSFERREDTOBAR &&
      message.editType === EditTypes.UPDATE
    ) {
      return this.editTransferedFee(
        message.feeDetail,
        message.originalFeeDetail
      );
    }
    // check if we already have a fee_id
    let method = "post";
    if (message.feeDetail.case_fee_id) {
      method = "put";
    }

    message.feeDetail.payment_instruction_id = this.model.id;
    return this.feeLogService
      .addEditFeeToCase(this.loadedId, message.feeDetail, method)
      .then(() => {
        return this.loadPaymentInstructionById(this.model.id);
      })
      .catch(error => {
        console.error(error);
      });
  }

  editTransferedFee(
    feeDetail: ICaseFeeDetail,
    originalFeeDetail: ICaseFeeDetail
  ): Promise<any> {
    const negatedFeeDetail = this.negateFeeDetail(originalFeeDetail);

    // have to set the case_id to null in both post
    negatedFeeDetail.case_fee_id = null;
    this.feeDetail.case_fee_id = null;

    return this.feeLogService
      .addEditFeeToCase(this.loadedId, negatedFeeDetail, "post")
      .then(() =>
        this.feeLogService.addEditFeeToCase(this.loadedId, feeDetail, "post")
      )
      .then(() => {
        return this.loadPaymentInstructionById(this.model.id);
      })
      .catch(err => {
        console.error(err);
      });
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
      .then(responses => {
        if (responses[0].success && responses[1].success) {
          this.model.assign(responses[0].data);
          this.model.unallocated_amount = responses[1].data;

          console.log(this.model.status);
          // this.model.case_fee_details = orderFeeDetails(this.model.case_fee_details);
        } else {
          const errorMessage = responses
            .filter(resp => !resp.success)
            .map(resp => resp.data)
            .join(",");
          throw new Error(errorMessage);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  goBack() {
    this.location.back();
  }

  onProcessPaymentSubmission(model: PaymentInstructionModel) {
    this.paymentInstructionActionModel.action = PaymentAction.PROCESS;
    this.feeLogService
      .sendPaymentInstructionAction(model, this.paymentInstructionActionModel)
      .then(() => {
        this.paymentInstructionActionModel = new PaymentInstructionActionModel();
        return this.router.navigateByUrl("/feelog");
      })
      .catch(err => console.log(err));
  }

  onSuspenseFormSubmit(e) {
    e.preventDefault();
    if (this.paymentInstructionActionModel.hasOwnProperty("reason")) {
      this.feeLogService
        .sendPaymentInstructionAction(
          this.model,
          this.paymentInstructionActionModel
        )
        .then(() => {
          this.paymentInstructionActionModel = new PaymentInstructionActionModel();
          this.suspenseModalOn = !this.suspenseModalOn;
          return this.router.navigateByUrl("/feelog");
        })
        .catch(err => console.log(err));
    }
  }

  returnPaymentToPostClerk() {
    this.model.status = PaymentStatus.VALIDATED;
    this.model.action = PaymentAction.RETURNS;

    this.feeLogService.updatePaymentModel(this.model).then(res => {
      this.toggleReturnModal();
      return this.router.navigateByUrl("/feelog");
    });
  }

  getUnallocatedAmount(): number {
    return (
      this.model.unallocated_amount -
      this.delta.amountDelta * 100 +
      this.delta.remissionDelta * 100 -
      this.delta.refundDelta * 100
    );
  }

  toggleRefundModal() {
    this.refundModalOn = !this.refundModalOn;
  }
  toggleReturnModal() {
    this.returnModalOn = !this.returnModalOn;
  }
  toggleSuspenseModal() {
    this.suspenseModalOn = !this.suspenseModalOn;
  }

  changeStatusToRefund() {
    this.model.action = PaymentAction.REFUNDED;
    this.model.status = PaymentStatus.VALIDATED;
    this.feeLogService.updatePaymentModel(this.model).then(res => {
      this.toggleReturnModal();
      return this.router.navigateByUrl("/feelog");
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
  }

  closeDetails() {
    this.mainComponentOn = true;
    this.feeDetailsComponentOn = false;
  }

  updateUnallocatedAmount(delta: UnallocatedAmountEventMessage) {
    this.delta = delta;
  }

  collectCaseReferences(): Array<String> {
    return this.model.case_fee_details
      ? _.uniq(this.model.case_fee_details.map(it => it.case_reference))
      : [];
  }

  onSuspensePayment() {
    this.suspenseModalOn = true;
  }

  onReturnPayment() {
    this.returnModalOn = true;
  }

  onPaymentReversion(e: undefined) {
    const paymentInstructionModel: PaymentInstructionModel = _.clone(
      this.model
    );
    paymentInstructionModel.status = PaymentStatus.getPayment("Pending").code;

    this.feeLogService
      .updatePaymentModel(paymentInstructionModel)
      .then(() => (this.model = paymentInstructionModel))
      .catch(console.log);
  }
}
