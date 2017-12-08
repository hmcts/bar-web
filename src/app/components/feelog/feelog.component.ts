import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { IFeeLog } from '../../interfaces/fee-log';
import { UserService } from '../../services/user/user.service';
import { PaymentStatus } from '../../models/paymentstatus.model';

@Component({
  selector: 'app-feelog',
  templateUrl: './feelog.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./feelog.component.css']
})
export class FeelogComponent implements OnInit {
  fee_logs: IFeeLog[] = [];

  constructor(private paymentsLogService: PaymentslogService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    try {
      const feelog: any = await this.paymentsLogService.getPaymentsLog(PaymentStatus.pending);
      for (let i = 0; i < feelog.data.length; i++) {
        this.fee_logs.push(feelog.data[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* @TODO: when form is being submitted, do what is necessary */
  onFormSubmission(): void {}

}
