import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaymentsLog } from '../../interfaces/payments-log';

import { UserService } from '../../services/user/user.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { FeeLogModel } from '../../models/feelog.model';
import { IFeeLog } from '../../interfaces/fee-log';

@Component({
  selector: 'app-feelog',
  templateUrl: './feelog.component.html',
  providers: [],
  styleUrls: ['./feelog.component.css']
})
export class FeelogComponent implements OnInit {
  fee_logs: IPaymentsLog[] = [];

  constructor(
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    // @TODO: Call API and get the fee logs
  }

  /* @TODO: when form is being submitted, do what is necessary */
  onFormSubmission(): void {}

  getPaymentLogsList(): IPaymentsLog[] {
    return [];
  }

}
