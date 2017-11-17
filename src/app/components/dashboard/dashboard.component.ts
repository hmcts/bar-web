import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UserService } from '../../services/user/user.service';
import { IPaymentType } from '../../interfaces/payment-types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [PaymenttypeService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  payment_types: IPaymentType[] = [];
  filledContent = false;
  data = {
    account_number: '',
    allpay_transaction_id: '',
    amount: '',
    cheque_number: '',
    currency: 'GBP',
    payment_type: 0,
    payer_name: '',
    postal_order_type: '',
    sort_code: ''
  };

  constructor(private paymentTypeService: PaymenttypeService, private userService: UserService, private router: Router) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    try {
      const paymentTypes = await this.paymentTypeService.getPaymentTypes();
      for (const property in paymentTypes) {
        if (paymentTypes.hasOwnProperty(property)) {
          this.payment_types.push(paymentTypes[property]);
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  async onFormSubmission() {
    const data = this._cleanData();
    try {
      const makePayment = await this.paymentTypeService.createPostPayment(data);
      console.log( makePayment );
      this._resetData();
    } catch (e) {

    }
  }

  changePaymentType(paymentTypeId): void {
    this.filledContent = true;
    this.data.payment_type = paymentTypeId;

    // revert back to initial date except amount and payee name
    this.data.account_number = '';
    this.data.cheque_number = '';
    this.data.sort_code = '';
  }

  onInputPropertyChange($ev): void {
    const value = $ev.target.getAttribute('name');
    if (this.data[value].trim().length > 0) {
      this.filledContent = true;
    } else {
      if (!this.data.payment_type) {
        this.filledContent = false;
      }
    }
  }

  _cleanData(): {} {
    const cleanData = {};
    for (const property in this.data) {
      if (this.data.hasOwnProperty(property) && this.data[property] !== '') {
        cleanData[property] = this.data[property];
      }
    }

    return cleanData;
  }

  _resetData(): void {
    this.data.account_number = '';
    this.data.allpay_transaction_id = '';
    this.data.cheque_number = '';
    this.data.postal_order_type = '';
    this.data.sort_code = '';
  }
}
