import { Injectable } from '@angular/core';
import { IPaymentState } from '../interfaces/paymentstate';

@Injectable()
export class PaymentstateService implements IPaymentState {

  state = {
    paymentTypes: [],
    currentOpenedFeeTab: 1 // set as 1 by default
  };

  constructor() { }

  setSharedPaymentTypes(data: Array<any>) {
    this.state.paymentTypes = data;
  }

  setCurrentOpenedFeeTab(currentTab) {
    this.state.currentOpenedFeeTab = currentTab;
  }

}
