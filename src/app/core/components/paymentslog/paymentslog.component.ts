import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { UserService } from '../../../shared/services/user/user.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UtilService } from '../../../shared/services/util/util.service';
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
    for (let i = 0; i < this.payments_logs.length; i++) {
      const model = this.payments_logs[i];
      const payment: PaymentInstructionModel = new PaymentInstructionModel();
      payment.assign( model );

      if (payment.selected) {
        payment.status = PaymentStatus.PENDING;
        const [err, data] = await UtilService
          .toAsync(this.paymentTypeService.savePaymentModel(payment));
      }
    }

    this.getPaymentLogs();
    this.selectAllPosts = false;
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
      this.selectAllPosts = false;
    }
  }

  getPaymentLogs() {
    return this.paymentsLogService
      .getPaymentsLog(this.userService.getUser(), PaymentStatus.DRAFT)
      .then((response: IResponse) => {
        this.payments_logs = [];
        if (response.success) {}

        response.data.forEach((payment: IPaymentsLog) => {
          const model = new PaymentInstructionModel();
          model.assign( payment );
          model.selected = false;
          this.payments_logs.push( model );
        });
      })
      .catch(() => console.log('Seems to be a problem.'));
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
