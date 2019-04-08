import {Component, HostListener, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../shared/services/user/user.service';
import {IPaymentType, IResponse} from '../../interfaces';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {UserModel} from '../../models/user.model';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import * as _ from 'lodash';
import {PaymentStateService} from '../../../shared/services/state/paymentstate.service';
import {PaymentTypeEnum} from '../../models/payment.type.enum';
import {PaymentType} from '../../../shared/models/util/model.utils';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPaymentsLog} from '../../interfaces/payments-log';
import {RemissionModel} from '../../models/remission.model';

const DEFAULT_DICTIONARY = {
  title: 'Payment',
  confirmation: 'Payment information added',
  buttonText: 'Add payment'
};

const REMISSION_DICTIONARY = {
  title: 'Full remission payment instruction',
  confirmation: 'Remission information added',
  buttonText: 'Add remission'
};

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  providers: [PaymentInstructionsService],
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  model: IPaymentsLog = new PaymentInstructionModel();
  changePayment = false;
  loadedId: number;
  newId: number;
  newDailySequenceId: number;
  paymentInstructionSuggestion = false;
  paymentTypes$: BehaviorSubject<IPaymentType[]> = new BehaviorSubject<IPaymentType[]>([]);
  paymentTypeEnum$: BehaviorSubject<PaymentTypeEnum> = new BehaviorSubject<PaymentTypeEnum>(new PaymentTypeEnum());
  dictionary = DEFAULT_DICTIONARY;
  saveDisabled = false;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    public location: Location,
    private _paymentStateService: PaymentStateService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => this.onRouteParams(params), err => console.log(err));
    this._paymentStateService.paymentTypes.subscribe(types => {
      this.paymentTypes$.next(types);
      const hash = decodeURIComponent(window.location.hash);
      if (hash && hash === '#remission') {
        this.addFullRemission();
      }
    });
    this._paymentStateService.paymentTypeEnum.subscribe(ptEnum => this.paymentTypeEnum$.next(ptEnum));
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (event.state && event.state.navigationId) {
      this.model = new PaymentInstructionModel();
      this.dictionary = DEFAULT_DICTIONARY;
    }
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

  get continueToPaymentUrl(): any {
    switch (this._userService.getUser().type) {
      case UserModel.TYPES.postclerk.type:
        return { uri: ['/dashboard/payment/edit/', this.newId].join(''), fragment: '' };
      case UserModel.TYPES.feeclerk.type:
        return { uri: ['/feelog/edit/', this.newId].join(''), fragment: 'fees' };
      default:
        return { uri: '', fragment: ''};
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

  // ------------------------------------------------------------------------------------------
  addAnotherPayment() {
    this.dictionary = DEFAULT_DICTIONARY;
    this.model = new PaymentInstructionModel();
    this.paymentInstructionSuggestion = !this.paymentInstructionSuggestion;
    window.location.hash = '';
  }

  getPaymentInstructionById(paymentID): void {
    this._paymentInstructionService
      .getPaymentInstructionById(paymentID)
      .subscribe((response: IResponse) => {
        this.model = response.data;
        if (this.model.payment_type.id === PaymentType.FULL_REMISSION) {
          this.dictionary = REMISSION_DICTIONARY;
        } else {
          this.dictionary = DEFAULT_DICTIONARY;
        }
      }, err => console.log(err));
  }

  resetPaymentTypeFields() {
    delete this.model.all_pay_transaction_id;
    delete this.model.authorization_code;
    delete this.model.cheque_number;
    delete this.model.postal_order_number;
  }
  // ------------------------------------------------------------------------------------------
  onFormSubmission(e?): void {
    this.saveDisabled = true;
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
          (<PaymentInstructionModel>this.model).assign(response.data);
          this.newDailySequenceId = _.assign(this.model.daily_sequence_id);
          this.newId = _.assign(this.model.id);
        }

        if ((response.data && response.data.status === PaymentStatus.DRAFT) && type === UserModel.TYPES.feeclerk.type) {
          this.model.status = PaymentStatus.PENDING;
          this.onFormSubmission();
        }
        this.paymentInstructionSuggestion = true;
      }, console.log, () => this.saveDisabled = false);

  }

  onRouteParams(params): void {
    const id: number = params.id ? parseInt(params.id, 0) : NaN;
    if (isNaN(id)) return;
    this.loadedId = id;
    this.getPaymentInstructionById(id);
    this.changePayment = (this._router.url.includes('/change-payment'));
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

  isPaymentTypeVisible(key: string): Observable<boolean> {
    return this.paymentTypeEnum$.pipe(map(paymentTypeEnum => {
      return this.model.payment_type.id === paymentTypeEnum[key];
    }));
  }

  getVisiblePaymentTypes(): IPaymentType[] {
    return this.paymentTypes$.getValue().filter(type => type.id !== PaymentType.FULL_REMISSION);
  }

  isRemissionAvailable(): boolean {
    return this.paymentTypes$.getValue().some(type => type.id === PaymentType.FULL_REMISSION);
  }

  addFullRemission(): void {
    this.dictionary = REMISSION_DICTIONARY;
    this.model = new RemissionModel();
    this.model.payment_type = this.paymentTypes$.getValue().find(type => type.id === PaymentType.FULL_REMISSION);
    this.resetPaymentTypeFields();
    window.location.hash = 'remission';
  }

  isPaymentTypeSelectorHidden(): boolean {
    return this.model.payment_type ? this.model.payment_type.id === PaymentType.FULL_REMISSION : false;
  }
}
