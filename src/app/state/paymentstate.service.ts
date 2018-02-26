import { Injectable } from '@angular/core';
import { IPaymentState } from '../interfaces/paymentstate';

@Injectable()
export class PaymentstateService implements IPaymentState {

  state = {
    currentOpenedFeeTab: 1, // set as 1 by default
    paymentTypes: []
  };

  constructor() { }

  setSharedPaymentTypes(data: Array<any>) {
    this.state.paymentTypes = data;
  }

  setCurrentOpenedFeeTab(currentTab) {
    this.state.currentOpenedFeeTab = currentTab;
  }

}
