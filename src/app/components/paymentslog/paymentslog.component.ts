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

  constructor(private paymentsLogService: PaymentslogService,
    private userService: UserService,
    private router: Router) { }

    async ngOnInit() {
      if (!this.userService.getUser()) {
        this.router.navigateByUrl('/');
      }

      try {
        const paymentslog = await this.paymentsLogService.getPaymentsLog();
        for (const property in paymentslog) {
          if (paymentslog.hasOwnProperty(property)) {
            this.payments_logs.push(paymentslog[property]);
          }
        }
      } catch (error) {
         console.log(error);
      }
    }

}
