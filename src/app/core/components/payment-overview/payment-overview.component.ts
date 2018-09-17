import { Component, OnInit, Input } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';
import { UserService } from '../../../shared/services/user/user.service';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { UserRole } from '../../models/userrole.model';
import { OverviewData } from '../../models/overviewdata.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import * as moment from 'moment';

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
  total = 0;
  showModal = false;
  loading = false;
  payhubReport = {
    total: 0,
    success: 0
  };
  _transferDate = moment().add(-1, 'days').format('YYYY-MM-DD');
  dateTill = moment().format('YYYY-MM-DD');
  dateSelectorVisible = true;
  remoteError = null;
  errors = [];
  confirmDisabled = false;

  get transferDate() {
    return this._transferDate;
  }

  set transferDate(strDate: string) {
    this._transferDate = strDate;
    if (!this._transferDate) {
      this.confirmDisabled = true;
    } else {
      this.confirmDisabled = false;
    }
  }

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private paymentOverviewService: PaymentsOverviewService,
    private http: BarHttpClient
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

    this.createDeliveryManagerOverview();

    this.paymentOverviewService
      .getPaymentsOverview(this.status)
      .subscribe((result: IResponse) => {
          if (!result.success) {
            this.errors.push(result.message);
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

  createDeliveryManagerOverview() {
    if (this.userService.getUser().roles.indexOf(UserRole.DELIVERYMANAGER) > -1) {
      this.paymentOverviewService
      .getPaymentsOverview(PaymentStatus.TRANSFERREDTOBAR)
      .subscribe({
        next: (result: IResponse) => {
          if (!result.success) {
            this.errors.push(result.message);
            return false;
          }
          this.handleDeliveryManagerData(result.data);
        },
        error: console.log
      });
    }
  }

  handleDeliveryManagerData(deliveryManagerData) {
    this.total = 0;
    this.deliveryManagers = [];
    const keys = Object.keys(deliveryManagerData);
    let i;
    for (i = 0; i < keys.length; i++) {
      const model = new OverviewData();
      deliveryManagerData[keys[i]].forEach(data => {
        if (data.hasOwnProperty('bar_user_full_name')) {
          model.userFullName = data.bar_user_full_name;
        }
        model.userRole = UserRole.DELIVERYMANAGER;
        if (data.hasOwnProperty('bar_user_id')) {
          model.userId = data.bar_user_id;
        }
        model.readyToTransferToBar = data.count_of_payment_instruction_in_specified_status;
      });

      this.deliveryManagers.push(model);
      this.total += model.readyToTransferToBar;
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
      })
      .catch((err) => console.error(err));
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

  openModal() {
    this.showModal = true;
    this.dateSelectorVisible = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onClickConfirm() {
    this.remoteError = null;
    this.dateSelectorVisible = false;
    this.payhubReport = {success: 0, total: 0};
    this.http.get(`/api/payment-instructions/send-to-payhub/${moment(this.transferDate).toDate().getTime()}`)
      .subscribe(payhubReport => {
      this.payhubReport = payhubReport.data;
      this.loading = false;
    }, (error) => {
      this.remoteError = error.message || 'Server error';
      this.loading = false;
    });
    this.showModal = true;
    this.loading = true;
  }

  returnUploadModal() {
    this.showModal = false;
    this.openedTab = 4;
    this.createDeliveryManagerOverview();
  }
}
