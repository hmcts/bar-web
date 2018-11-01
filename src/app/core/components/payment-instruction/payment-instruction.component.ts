import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { UserModel } from '../../models/user.model';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import * as _ from 'lodash';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentTypeEnum } from '../../models/payment.type.enum';
import { PaymentType } from '../../../shared/models/util/model.utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  providers: [PaymentInstructionsService],
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  changePayment = false;
  loadedId: number;
  newId: number;
  newDailySequenceId: number;
  paymentInstructionSuggestion = false;
  paymentTypes$: BehaviorSubject<PaymentType[]> = new BehaviorSubject<PaymentType[]>([]);
  paymentTypeEnum$: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    public location: Location,
    private _paymentStateService: PaymentstateService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => this.onRouteParams(params), err => console.log(err));
    this._paymentStateService.paymentTypes.subscribe(types => {
      this.paymentTypes$.next(types);
    });
    this._paymentStateService.paymentTypeEnum.subscribe(ptEnum => {
      this.paymentTypeEnum$.next(ptEnum);
    });
  }

  get cleanModel(): PaymentInstructionModel {
    const model = new PaymentInstructionModel();
    Object.keys(this.model).forEach(key => {
      if (!_.isEmpty(this.model[key]) || !_.isNull(this.model[key])) {
        model[key] = this.model[key];
      }
    });

    return model;
  }

  get continueToPaymentUrl(): string {
    switch (this._userService.getUser().type) {
      case UserModel.TYPES.postclerk.type:
        return ['/dashboard/payment/edit/', this.newId].join('');
      case UserModel.TYPES.feeclerk.type:
        return ['/feelog/edit/', this.newId].join('');
      default:
        return '';
    }
  }

  get getPaymentInstructionListUrl(): string {
    switch (this._userService.getUser().type) {
      case UserModel.TYPES.postclerk.type:
        return ['/paymentslog'].join('');
      case UserModel.TYPES.feeclerk.type:
        return ['/feelog'].join('');
      default:
        return '';
    }
  }

  get user() {
    return this._userService.getUser();
  }

  get everyFieldIsFilled(): boolean {
    const keys = _.chain(Object.keys(this.model))
      .reject(key => (key === 'currency') || (key === 'unallocated_amount') || (key === 'case_fee_details'));

    // if we have these fields other than those above, then go here...
    if (keys.value().length > 0) {
      const emptyFields = keys
        .map(key => this.model[key])
        .filter(value => _.isNull(value) || _.isEmpty(value.toString()) || _.isEqual(value, ''))
        .value();

      return emptyFields.length > 0;
    }

    return false;
  }

  // ------------------------------------------------------------------------------------------
  addAnotherPayment() {
    this.model = new PaymentInstructionModel();
    this.paymentInstructionSuggestion = !this.paymentInstructionSuggestion;
  }

  getPaymentInstructionById(paymentID): void {
    this._paymentInstructionService.getPaymentInstructionById(paymentID)
      .subscribe(
        (response: IResponse) => this.model = response.data,
        err => console.log(err)
      );
  }

  resetPaymentTypeFields() {
    delete this.model.all_pay_transaction_id;
    delete this.model.authorization_code;
    delete this.model.cheque_number;
    delete this.model.postal_order_number;
  }
  // ------------------------------------------------------------------------------------------
  onFormSubmission(e?): void {
    if (e) {
      e.preventDefault();
    }

    const { type } = this._userService.getUser();
    this._paymentInstructionService
      .savePaymentInstruction(this.cleanModel)
      .subscribe((response: IResponse) => {
        if (!response.data && response.success && this.loadedId) {
          return this._router.navigateByUrl( this.getPaymentInstructionListUrl );
        }

        this.model = new PaymentInstructionModel();
        if (response.data) {
          this.model.assign(response.data);
          this.newDailySequenceId = _.assign(this.model.daily_sequence_id);
          this.newId = _.assign(this.model.id);
        }

        if ((response.data && response.data.status === PaymentStatus.DRAFT) && type === UserModel.TYPES.feeclerk.type) {
          this.model.status = PaymentStatus.PENDING;
          this.onFormSubmission();
        }
        this.model.resetData();
        this.paymentInstructionSuggestion = true;
      },
        console.log
      );
  }

  onRouteParams(params): void {
    const id: number = params.id ? parseInt(params.id, 0) : NaN;
    if (!isNaN(id)) {
      this.loadedId = id;
      this.getPaymentInstructionById(id);
      this.changePayment = (this._router.url.includes('/change-payment'));
    }
  }

  onSelectPaymentType(paymentType: IPaymentType) {
    this.model.payment_type = paymentType;
    this.resetPaymentTypeFields();
    this.paymentTypeEnum$.subscribe(paymentTypeEnum => {
      if (paymentType.id === paymentTypeEnum.ALLPAY) { this.model.all_pay_transaction_id = ''; }
      if (paymentType.id === paymentTypeEnum.CARD) { this.model.authorization_code = ''; }
      if (paymentType.id === paymentTypeEnum.CHEQUE) { this.model.cheque_number = ''; }
      if (paymentType.id === paymentTypeEnum.POSTAL_ORDER) { this.model.postal_order_number = ''; }
    });
  }

  isPaymentTypeHidden(key: string): Observable<boolean> {
    return this.paymentTypeEnum$.pipe(map(paymentTypeEnum => {
      return this.model.payment_type.id !== paymentTypeEnum[key];
    }));
  }

}
