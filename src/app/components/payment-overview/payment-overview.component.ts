import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';
import { PaymentstateService } from '../../state/paymentstate.service';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.css'],
  providers: [PaymentslogService]
})
export class PaymentOverviewComponent implements OnInit {
  openedTab = 2;
  paymentInstructionModels: PaymentInstructionModel[] = [];
  count = {
    validated: 0,
    readyToReview: 0,
    approved: 0,
    transferredToBar: 0
  };

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private paymentStateService: PaymentstateService
  ) { }

  ngOnInit() {
    console.log( this.userService.getUser() );

    // TODO: Have the user type saved as a CONSTANT
    if (this.userService.getUser().type === 'deliverymanager') {
      this.openedTab = 3;
    }

    this.getPendingApprovalPayments();

    /**
     * TODO
     * Ensure you load all payments,
     * for the sake of calculating
     * the number of validated, ready
     * to review, approved and transferred
     * to BAR payments
     *
     * This method will have to be changed when API endpoints are done
     */
    this.getAllPaymentsForCalculation();
  }

  get user (): UserModel {
    return this.userService.getUser();
  }

  changeTabs(tabNumber: number) { this.openedTab = tabNumber; }

  async getPendingApprovalPayments() {
    const [err, data] = await UtilService.toAsync( this.paymentsLogService.getPaymentsLog(PaymentStatus.PENDINGAPPROVAL) );

    if (err) {
      // handle the error
    }

    const response: IResponse = data;
    if (response.data.length > 0) {
      this.paymentInstructionModels = response.data.map((paymentInstructionModel: PaymentInstructionModel) => {
        const model = new PaymentInstructionModel();
        model.assign(paymentInstructionModel);
        return model;
      });
    }
  }

  async getAllPaymentsForCalculation() {
    const [vErr, validatedPayments] = await UtilService.toAsync( this.paymentsLogService.getPaymentsLog(PaymentStatus.VALIDATED) );
    const validatedResponse: IResponse = validatedPayments;

    if (validatedResponse.success) {
      this.count.validated = validatedResponse.data.length;
    }

    const [rtrError, readyToReviewPayments] = await UtilService
      .toAsync( this.paymentsLogService.getPaymentsLog(PaymentStatus.PENDINGAPPROVAL) );
    const readyToReviewResponse: IResponse = readyToReviewPayments;

    if (readyToReviewResponse.success) {
      this.count.readyToReview = readyToReviewResponse.data.length;
    }

    const [aError, approvedPayments] = await UtilService.toAsync( this.paymentsLogService.getPaymentsLog(PaymentStatus.APPROVED) );
    const approvedResponse: IResponse = approvedPayments;

    if (approvedResponse.success) {
      this.count.approved = approvedResponse.data.length;
    }

    const [tError, transferredToBarPayments] = await UtilService
      .toAsync( this.paymentsLogService.getPaymentsLog(PaymentStatus.TRANSFERREDTOBAR) );
    const transferredToBarResponse: IResponse = transferredToBarPayments;

    if (transferredToBarResponse.success) {
      this.count.transferredToBar = transferredToBarResponse.data.length;
    }
  }

}
