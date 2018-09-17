import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IPaymentsLog } from '../../../core/interfaces/payments-log';
import { UserModel } from '../../../core/models/user.model';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { UserRole } from '../../../core/models/userrole.model';

@Injectable()
export class UtilService {
  constructor() {}

  static toAsync(promise: Promise<Object>): any {
    return promise.then(data => [null, data]).catch(err => [err]);
  }

  static convertToUpperCase(str: string) {
    const stringArray = str.toLowerCase().split(' ');
    return stringArray.map(letter => _.capitalize(letter)).join(' ');
  }

  static checkIfReadOnly(paymentInstruction: IPaymentsLog, user?: UserModel) {
    if ( !(user.roles.indexOf(UserRole.FEECLERK) > -1) ||
      (paymentInstruction.status !== PaymentStatus.getPayment('Pending').code &&
      paymentInstruction.status !== PaymentStatus.getPayment('Rejected').code)
    ) {
      return true;
    }
    return false;
  }
}
