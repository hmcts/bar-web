import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.css'],
  providers: [PaymentslogService]
})
export class PaymentOverviewComponent implements OnInit {
  openedTab = 2;
  paymentInstructionModels: PaymentInstructionModel[] = new Array<PaymentInstructionModel>();

  constructor(private userService: UserService, private paymentsLogService: PaymentslogService) { }

  ngOnInit() {
    console.log( this.userService.getUser() );
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

      console.log( this.paymentInstructionModels );
    }
  }

  calculateValidatedPayments () {

  }
  calculateTransferredToBar () {}
  calculateApproved () {}
  calculateReadyToReview () {}

}
