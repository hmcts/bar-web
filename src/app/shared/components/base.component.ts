import { OnInit, Component, Injectable } from '@angular/core';
import { PaymentTypeEnum } from '../../core/models/payment.type.enum';
import { PaymentstateService } from '../services/state/paymentstate.service';
import { IPaymentType } from '../../core/interfaces';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class BaseComponent implements OnInit {
  paymentTypeEnum: PaymentTypeEnum;
  paymentTypes: IPaymentType[];

  protected paymentStateService: PaymentstateService;

  constructor(paymentStateService: PaymentstateService) {
    this.paymentStateService = paymentStateService;
  }

  ngOnInit() {
    forkJoin([
      this.paymentStateService.paymentTypes,
      this.paymentStateService.paymentTypeEnum
    ]).subscribe(([pTypes, pTypeEnum]) => {
      this.paymentTypes = pTypes;
      this.paymentTypeEnum = pTypeEnum;
      this.runAfterInit();
    });
  }

  abstract runAfterInit(): void;

}
