import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel = new FeeLogModel();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentLogService: PaymentslogService) { }

  ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadFeeById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async loadFeeById(feeId) {
    try {
      const request = await this.paymentLogService.getPaymentById(feeId);
      console.log( request.data );
      if (request.success === true) {
        this.model = request.data;
      }
    } catch (e) {
      console.log( e );
    }
  }

}
