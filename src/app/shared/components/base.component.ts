import { OnInit, Component, Injectable } from '@angular/core';
import { PaymentTypeEnum } from '../../core/models/payment.type.enum';
import { PaymentstateService } from '../services/state/paymentstate.service';
import { IPaymentType } from '../../core/interfaces';

@Injectable()
export abstract class BaseComponent implements OnInit {
  paymentTypeEnum: PaymentTypeEnum;
  paymentTypes: IPaymentType[];

  protected paymentStateService: PaymentstateService;

  ngOnInit(): Promise<any> {
    return this.paymentStateService.paymentTypes
      .then(types => {
        this.paymentTypes = types;
      })
      .then(() => {
        return this.paymentStateService.paymentTypeEnum;
      })
      .then(ptEnum => {
        this.paymentTypeEnum = ptEnum;
      });
  }

  constructor(paymentStateService: PaymentstateService) {
    this.paymentStateService = paymentStateService;
  }
}
