import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';
import { UtilService } from '../../../shared/services/util/util.service';
import { UserService } from '../../../shared/services/user/user.service';

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
    private paymentsLogService: PaymentslogService
  ) { }

  ngOnInit() {
    // TODO: Have the user type saved as a CONSTANT
    if (this.userService.getUser().type === 'deliverymanager') {
      this.openedTab = 3;
    }

    this.getPendingApprovalPayments();
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

    // then update the counts
    this.getAllPaymentsForCalculation();
  }

  getAllPaymentsForCalculation() {
    this.paymentsLogService.getPaymentsLog().then((response: IResponse) => {
      if (response.success) {
        const data: PaymentInstructionModel[] = response.data;
        this.count.approved = this.countPaymentInstructionsByStatus(data, 'Approved').length;
        this.count.readyToReview = this.countPaymentInstructionsByStatus(data, 'Pending Approval').length;
        this.count.transferredToBar = this.countPaymentInstructionsByStatus(data, 'Transferred to bar').length;
        this.count.validated = this.countPaymentInstructionsByStatus(data, 'Validated').length;

        // TODO: get payments by action
      }
    });
  }

  private countPaymentInstructionsByStatus (paymentInstructions: PaymentInstructionModel[], status: string): PaymentInstructionModel[] {
    return paymentInstructions.filter(paymentInstructionModel => paymentInstructionModel.status === status);
  }

  private countPaymentInstructionsByActions (paymentInstructions: PaymentInstructionModel[], action: string): PaymentInstructionModel[] {
    return paymentInstructions.filter(paymentInstructionModel => paymentInstructionModel.action === action);
  }

}
