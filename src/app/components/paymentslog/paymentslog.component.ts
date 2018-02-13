import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { UserService } from '../../services/user/user.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UtilService } from '../../services/util/util.service';
import { IResponse } from '../../interfaces/response';


@Component({
  selector: 'app-components',
  templateUrl: './paymentslog.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./paymentslog.component.css']
})
export class PaymentslogComponent implements OnInit {

  payments_logs: IPaymentsLog[] = [];
  fieldSelected = false;
  selectAllPosts = false;
  multipleSelectedPosts = 0;

  constructor(
    private paymentsLogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    this.getPaymentLogs();
  }

  onAlterCheckedState(post): void {
    const currentPost = this.payments_logs.findIndex(thisPost => {
      return post === thisPost;
    });
    this.payments_logs[currentPost].selected = !this.payments_logs[currentPost].selected;
    this.fieldSelected = this.hasSelectedFields();
    this.multipleSelectedPosts = this.countNumberOfPosts();

    if (this.multipleSelectedPosts === this.payments_logs.length) {
      this.selectAllPosts = true;
    } else {
      this.selectAllPosts = false;
    }
  }

  async onFormSubmission() {
    this.payments_logs.forEach(async(payment: PaymentInstructionModel) => {
      if (payment.selected) {
        payment.status = PaymentStatus.PENDING;
        const [err, data] = await UtilService.toAsync(this.paymentTypeService.savePaymentModel(payment));
        return payment;
      }
    });

    this.getPaymentLogs();
  }

  onSelectAllPosts(): void {
    this.selectAllPosts = !this.selectAllPosts;
    this.payments_logs.forEach(payment => payment.selected = this.selectAllPosts);
    this.fieldSelected = this.hasSelectedFields();
  }

  async onFormSubmissionDelete() {
    const paymentLog: IPaymentsLog = this.payments_logs.find(value => value.selected === true);
    if (paymentLog) {
      await UtilService.toAsync(this.paymentsLogService.deletePaymentLogById(paymentLog.id));
      this.getPaymentLogs();
    }
  }

  async getPaymentLogs() {
    const [err, data] = await UtilService.toAsync(this.paymentsLogService.getPaymentsLog(PaymentStatus.DRAFT));
    this.payments_logs = [];

    if (!err) {
      const response: IResponse = data;
      if (response.success) {
        response.data.forEach((payment: IPaymentsLog) => {
          payment.selected = false;
          this.payments_logs.push(payment);
        });
      }
    }
  }

  hasSelectedFields(): boolean {
    let selectedFields = false;
    for (let i = 0; i < this.payments_logs.length; i++) {
      if (this.payments_logs[i].selected) {
        selectedFields = true;
        break;
      }
    }

    return selectedFields;
  }

  countNumberOfPosts(): number {
    let numberOfSelected = 0;
    for (let i = 0; i < this.payments_logs.length; i++) {
      if (this.payments_logs[i].selected) {
        numberOfSelected++;
      }
    }

    return numberOfSelected;
  }
}
