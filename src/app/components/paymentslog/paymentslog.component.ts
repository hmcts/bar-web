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

  constructor(private paymentsLogService: PaymentslogService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    // if (!this.userService.getUser()) {
    //   this.router.navigateByUrl('/');
    // }

    try {
      const paymentslog = await this.paymentsLogService.getPaymentsLog();
      for (const property in paymentslog) {
        if (paymentslog.hasOwnProperty(property)) {
          paymentslog[property].selected = false;
          this.payments_logs.push(paymentslog[property]);
        }
      }
      console.log( this.payments_logs );
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
}
