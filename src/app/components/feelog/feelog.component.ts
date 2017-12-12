import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';

@Component({
  selector: 'app-feelog',
  templateUrl: './feelog.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./feelog.component.css']
})
export class FeelogComponent implements OnInit {
  payments_logs: IPaymentsLog[] = [];

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private router: Router) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }
    this.getPaymentLogs();

    // @TODO: Call API and get the fee logs
  }

  /* @TODO: when form is being submitted, do what is necessary */
  onFormSubmission(): void {}

  private async getPaymentLogs() {
    this.payments_logs = [];
    try {
      const paymentslog: any = await this.paymentsLogService.getPaymentsLog(PaymentStatus.pending);
      for (let i = 0; i < paymentslog.data.length; i++) {
        paymentslog.data[i].selected = false;
        this.payments_logs.push(paymentslog.data[i]);
      }
      console.log( paymentslog );
    } catch (error) {
      console.log(error);
    }
  }

}
