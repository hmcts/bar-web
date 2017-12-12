import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { PaymentstoreService } from '../../services/paymentstore/paymentstore.service';
import { FeeLogModel } from '../../models/feelog.model';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel;

  constructor(private router: Router, private route: ActivatedRoute, private paymentStore: PaymentstoreService, private userService: UserService) { }

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
    this.model = await this.paymentStore.getFeeById(feeId);
    console.log( this.model );
  }

}
