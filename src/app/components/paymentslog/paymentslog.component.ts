import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-components',
  templateUrl: './paymentslog.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./paymentslog.component.css']
})
export class PaymentslogComponent implements OnInit {

  payments_logs: IPaymentsLog[] = [];
  fieldSelected = false;
  selectAllPosts = false;
  multipleSelectedPosts = 0;

  constructor(
    private paymentsLogService: PaymentslogService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    try {
      const paymentslog: any = await this.paymentsLogService.getPaymentsLog();
      console.log(paymentslog);
      for (let i = 0; i < paymentslog.data.length; i++) {
        paymentslog.data[i].selected = false;
        this.payments_logs.push(paymentslog.data[i]);
      }
    } catch (error) {
      console.log(error);
    }
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

  /* @TODO: when form is being submitted, do what is necessary */
  async onFormSubmission() {
    const paymentLogsToSubmit = [];
    for (let i = 0; i < this.payments_logs.length; i++) {
      if (this.payments_logs[i].selected) {
        paymentLogsToSubmit.push(this.payments_logs[i].id);
      }
    }
    const makePayment = await this.paymentsLogService.sendPendingPayments(paymentLogsToSubmit);
    console.log( makePayment );
  }

  onSelectAllPosts(): void {
    this.selectAllPosts = !this.selectAllPosts;

    for (let i = 0; i < this.payments_logs.length; i++) {
      this.payments_logs[i].selected = this.selectAllPosts;
    }

    this.fieldSelected = this.hasSelectedFields();
  }

  private hasSelectedFields(): boolean {
    let selectedFields = false;
    for (let i = 0; i < this.payments_logs.length; i++) {
      if (this.payments_logs[i].selected) {
        selectedFields = true;
        break;
      }
    }

    return selectedFields;
  }

  private countNumberOfPosts(): number {
    let numberOfSelected = 0;
    for (let i = 0; i < this.payments_logs.length; i++) {
      if (this.payments_logs[i].selected) {
        numberOfSelected++;
      }
    }

    return numberOfSelected;
  }
}
