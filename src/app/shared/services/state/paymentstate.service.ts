import { Injectable } from '@angular/core';
import { IPaymentState } from '../../../core/interfaces/paymentstate';
import { IPaymentType } from '../../../core/interfaces/payments-log';

@Injectable()
export class PaymentstateService implements IPaymentState {

  state = {
    currentOpenedFeeTab: 1, // set as 1 by default
    paymentTypes: []
  };

  constructor() { }

  setSharedPaymentTypes(data: IPaymentType[]) {
    this.state.paymentTypes = data;
  }

  setCurrentOpenedFeeTab(currentTab: number) {
    this.state.currentOpenedFeeTab = currentTab;
  }

}
