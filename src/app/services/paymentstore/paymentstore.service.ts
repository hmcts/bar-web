import { Injectable } from '@angular/core';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { FeeLogModel } from '../../models/feelog.model';

@Injectable()
export class PaymentstoreService {
  list: IPaymentsLog[] = [];

  constructor() {
    for (let i = 0; i < 6; i++) {
      let item = new FeeLogModel();
      item.id = i;
      item.payment_date = new Date;
      item.payer_name = `James McAuthur ${i+1}`;
      item.payment_type = 'cash';
      item.payment_reference = `ZXH00${i}`;
      item.amount = 3999*(i+1);
      item.status = 'pending';
      this.list.push(item);
    }
  }

  getList(): IPaymentsLog[] {
    return this.list;
  }

  addNewPayment(data: IPaymentsLog): void {
  }

  getFeeById(index: number): Promise<IPaymentsLog> {
    const fee = this.list[index];
    return new Promise(resolve => resolve(fee));
  }
}
