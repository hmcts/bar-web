import { Injectable } from '@angular/core';
import { IPaymentState } from '../interfaces/paymentstate';

@Injectable()
export class PaymentstateService implements IPaymentState {

  state = {
    paymentTypes: [],
    feeTabs: []
  };

  constructor() { }

  setSharedPaymentTypes(data: Array<any>) {
    this.state.paymentTypes = data;
  }

  setCurrentOpenedFeeTab() {

  }

}
