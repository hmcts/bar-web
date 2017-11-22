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
  showModal = false;
  
  data = {
    account_number: '',
    allpay_transaction_id: '',
    amount: '',
    instrument_number: '',
    currency: 'GBP',
    payment_type: 1,
    payer_name: '',
    postal_order_type: '',
    sort_code: ''
  };

  constructor(
    private paymentTypeService: PaymenttypeService,
    private userService: UserService,
    private router: Router
  ) { }

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
    const data = this.cleanData();
    try {
      const makePayment = await this.paymentTypeService.createPostPayment(data);
      this.resetData();
    } catch (e) {

    }
  }

  onInputPropertyChange($ev): void {
    // check if all the fields are empty or not
    if (this.hasPopulatedField()) {
      this.filledContent = true;
    } else {
      this.filledContent = false;
    }
  }

  onChangePaymentType(paymentTypeId): void {
    this.filledContent = true;
    this.data.payment_type = paymentTypeId;
    console.log( this.data )

    // revert back to initial date except amount and payee name
    this.resetData();
  }

  private hasPopulatedField(): boolean {
    let hasPopulatedField = false;

    for (const property in this.data) {
      if (this.data.hasOwnProperty(property)) {
        if (property === 'currency' || property === 'payment_type') {
          continue;
        }

        if (this.data[property].length > 0) {
          hasPopulatedField = true;
          break;
        }
      }
    }

    return hasPopulatedField;
  }

  private cleanData(): {} {
    const cleanData = {};
    for (const property in this.data) {
      if (
        this.data.hasOwnProperty(property) &&
        this.data[property] !== ''
      ) {
        if (property === 'amount') {
          cleanData[property] = parseFloat(this.data[property]) * 100;
        } else {
          cleanData[property] = this.data[property];
        }
      }
    }

    return cleanData;
  }

  private resetData(): void {
    this.data.account_number = '';
    this.data.allpay_transaction_id = '';
    this.data.instrument_number = '';
    this.data.postal_order_type = '';
    this.data.sort_code = '';
  }
}
