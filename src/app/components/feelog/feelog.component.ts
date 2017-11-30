import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeelogService } from '../../services/feelog/feelog.service';
import { IFeeLog } from '../../interfaces/fee-log';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-feelog',
  templateUrl: './feelog.component.html',
  providers: [FeelogService],
  styleUrls: ['./feelog.component.css']
})
export class FeelogComponent implements OnInit {
  fee_logs: IFeeLog[] = [];

  constructor(private feeLogService: FeelogService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    try {
      const feelog: any = await this.feeLogService.getFeeLog();
      for (let i = 0; i < feelog.length; i++) {
        this.fee_logs.push(feelog[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
