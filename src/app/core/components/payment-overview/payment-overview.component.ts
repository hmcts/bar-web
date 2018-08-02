import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';
import { UserService } from '../../../shared/services/user/user.service';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { UserRole } from '../../models/userrole.model';
import { OverviewData } from '../../models/overviewdata.model';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.css'],
  providers: [PaymentslogService, PaymentsOverviewService]
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
  userRole: string;
  status: string;

  postClerks = [];
  feeClerks = [];
  seniorFeeClerks = [];
  deliveryManagers = [];

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private paymentOverviewService: PaymentsOverviewService
  ) { }

  ngOnInit() {
    // TODO: Have the user type saved as a CONSTANT
    if (this.userService.getUser().type === 'deliverymanager') {
      this.openedTab = 3;
    }

    this.getPendingApprovalPayments();

    this.setStatusAndUserRoleForPaymentOverviewQuery();
    if (this.userService.getUser().roles.indexOf(UserRole.SRFEECLERK) > -1) {
      this.paymentOverviewService
        .getRejectedPaymentsOverview(PaymentStatus.REJECTEDBYDM, PaymentStatus.APPROVED)
        .subscribe((rejResult: IResponse) => {
          if (!rejResult.success) {
            console.log( rejResult.message );
            return false;
          }
          console.log( 'rejResultdata', rejResult.data );
          this.createRejectStatsOverview(rejResult.data);
        }, console.log);
    }

    this.paymentOverviewService
      .getPaymentsOverview(this.status)
      .subscribe((result: IResponse) => {
          if (!result.success) {
            console.log( result.message );
            return false;
          }

          if (this.userService.getUser().roles.indexOf(UserRole.SRFEECLERK) > -1) {
            this.createFeeClerksOverview(result.data);
          }
          if (this.userService.getUser().roles.indexOf(UserRole.DELIVERYMANAGER) > -1) {
            this.createSeniorFeeClerksOverview(result.data);
          }
        }, console.log);
  }

  get user (): UserModel {
    return this.userService.getUser();
  }

  arrangeOverviewComponent(result) {
    const keys = Object.keys(result);
    let i;
    for (i = 0; i < keys.length; i++) {
      if (keys[i] === 'bar-post-clerk') {
        this.createPostClerksOverview( result[keys[i]] );
      }

      if (keys[i] === 'bar-fee-clerk') {
        this.createFeeClerksOverview( result[keys[i]] );
      }
    }
  }

  createPostClerksOverview(postClerkData) {
    for (const id in postClerkData) {
      // this.postClerks = postClerkData[id].map(data => {
      //   const model = new OverviewData();
      //   model.assign(data);
      //   return model;
      // });
    }
  }

  createRejectStatsOverview(rejectStatsData) {
    const keys = Object.keys(rejectStatsData);
    let i;
    for (i = 0; i < keys.length; i++) {
      const model = new OverviewData();
      rejectStatsData[keys[i]].forEach(data => {
        model.piLink = `/users/${data.bar_user_id}/payment-instructions`;
        let queryString = JSON.stringify(data.list_of_payment_instructions);
        queryString = queryString.substring(1, queryString.length - 1);
        model.queryParams = {piIds: queryString};
        if (data.hasOwnProperty('bar_user_full_name')) {
          model.userFullName = data.bar_user_full_name;
        }
        model.userRole = UserRole.SRFEECLERK;
        if (data.hasOwnProperty('bar_user_id')) {
          model.userId = data.bar_user_id;
        }
        if (data.payment_instruction_status === PaymentStatus.VALIDATED) {
          model.validatedPayments = data.count_of_payment_instruction;
        }

        if (data.payment_instruction_status === PaymentStatus.PENDINGAPPROVAL) {
          model.submitted = data.count_of_payment_instruction;
        }
        model.readyToReview = data.count_of_payment_instruction_in_specified_status;
      });

      this.feeClerks.push(model);
    }

  }

  createFeeClerksOverview(feeClerksData) {
    const keys = Object.keys(feeClerksData);
    let i;
    for (i = 0; i < keys.length; i++) {
      const model = new OverviewData();
      feeClerksData[keys[i]].forEach(data => {
        model.piLink = `/users/${data.bar_user_id}/payment-instructions/stats`;
        model.queryParams = {status: this.status};
        if (data.hasOwnProperty('bar_user_full_name')) {
          model.userFullName = data.bar_user_full_name;
          model.queryParams.fullName = data.bar_user_full_name;
        }
        model.userRole = UserRole.FEECLERK;
        if (data.hasOwnProperty('bar_user_id')) {
          model.userId = data.bar_user_id;
        }
        if (data.payment_instruction_status === PaymentStatus.VALIDATED) {
          model.validatedPayments = data.count_of_payment_instruction;
        }

        if (data.payment_instruction_status === PaymentStatus.PENDINGAPPROVAL) {
          model.submitted = data.count_of_payment_instruction;
        }
        model.readyToReview = data.count_of_payment_instruction_in_specified_status;
      });

      this.feeClerks.push(model);
    }

  }

  createSeniorFeeClerksOverview(seniorFeeClerksData) {
    const keys = Object.keys(seniorFeeClerksData);
    let i;
    for (i = 0; i < keys.length; i++) {
      const model = new OverviewData();
      seniorFeeClerksData[keys[i]].forEach(data => {
        if (data.hasOwnProperty('bar_user_full_name')) {
          model.userFullName = data.bar_user_full_name;
        }
        model.userRole = UserRole.SRFEECLERK;
        if (data.hasOwnProperty('bar_user_id')) {
          model.userId = data.bar_user_id;
        }
        if (data.payment_instruction_status === PaymentStatus.APPROVED) {
          model.approved = data.count_of_payment_instruction;
        }

        if (data.payment_instruction_status === PaymentStatus.REJECTED) {
          model.rejected = data.count_of_payment_instruction;
        }
        model.readyToTransferToBar = data.count_of_payment_instruction_in_specified_status;
      });

      this.seniorFeeClerks.push(model);
    }

  }

  changeTabs(tabNumber: number) { this.openedTab = tabNumber; }

  getPendingApprovalPayments() {
    this.paymentsLogService.getPaymentsLog(this.userService.getUser(), PaymentStatus.PENDINGAPPROVAL)
      .then((response: IResponse) => {
        if (response.data.length < 1) {
          // throw an error here
          return;
        }

        this.paymentInstructionModels = response.data.map((paymentInstructionModel: PaymentInstructionModel) => {
          const model = new PaymentInstructionModel();
          model.assign(paymentInstructionModel);
          return model;
        });

        // then update the counts
        this.getAllPaymentsForCalculation();
      })
      .catch((err) => console.error(err));
  }

  getAllPaymentsForCalculation() {
    this.paymentsLogService.getPaymentsLog(this.userService.getUser())
      .then((response: IResponse) => {
        if (!response.success) {
          console.error(response.message);
          return;
        }

        const data: PaymentInstructionModel[] = response.data;
        this.count.approved = this.countPaymentInstructionsByStatus(data, 'Approved').length;
        this.count.readyToReview = this.countPaymentInstructionsByStatus(data, 'Pending Approval').length;
        this.count.transferredToBar = this.countPaymentInstructionsByStatus(data, 'Transferred to bar').length;
        this.count.validated = this.countPaymentInstructionsByStatus(data, 'Validated').length;

        // TODO: get payments by action
      })
      .catch((err) => console.error(err));
  }

  private countPaymentInstructionsByStatus (paymentInstructions: PaymentInstructionModel[], status: string): PaymentInstructionModel[] {
    return paymentInstructions.filter(paymentInstructionModel => paymentInstructionModel.status === status);
  }

  setStatusAndUserRoleForPaymentOverviewQuery() {
    if (this.userService.getUser().type === 'seniorfeeclerk') {
      this.changeTabs(2);
      this.userRole = UserRole.FEECLERK;
      this.status = PaymentStatus.PENDINGAPPROVAL;
    }
    if (this.userService.getUser().type === 'deliverymanager') {
      this.changeTabs(3);
      this.userRole = UserRole.SRFEECLERK;
      this.status = PaymentStatus.APPROVED;
    }
  }

}
