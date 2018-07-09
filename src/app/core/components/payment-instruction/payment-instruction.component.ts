import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { UserModel } from '../../models/user.model';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  providers: [PaymentInstructionsService, PaymenttypeService],
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentTypes: IPaymentType[] = [];
  changePayment = false;
  loadedId: number;
  newId: number;
  newDailySequenceId: number;
  paymentInstructionSuggestion = false;
  paymentInstructionForm: FormGroup;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => this.onRouteParams(params), console.log);
    this.getPaymentTypes();
    this.createForm();
  }

  get cleanModel(): PaymentInstructionModel {
    const model = new PaymentInstructionModel;
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
      .reject(key => (key === 'currency') || (key === 'unallocated_amount') || (key === 'payment_type'));

    // if we have these fields other than those above, then go here...
    if (keys.value().length > 0) {
      const emptyFields = keys.map(key => this.model[key]).filter(value => _.isEmpty(value) || _.isNull(value)).value();
      return (emptyFields.length > 0) ? false : true;
    }

    return false;
  }

  // ------------------------------------------------------------------------------------------
  addAnotherPayment() {
    this.model = new PaymentInstructionModel();
    this.paymentInstructionSuggestion = !this.paymentInstructionSuggestion;
  }

  createForm() {
    this.paymentInstructionForm = new FormGroup({
      id: new FormControl(this.model.id),
      amount: new FormControl(this.model.amount, [Validators.required, Validators.minLength(1)]),
      payment_type: new FormControl(this.model.payment_type, [Validators.required, Validators.minLength(1)]),
      payer_name: new FormControl(this.model.payer_name, [Validators.required, Validators.minLength(1)])
    });
  }

  getPaymentInstructionById(paymentID): void {
    this._paymentInstructionService
      .getPaymentInstructionById(paymentID)
      .subscribe((response: IResponse) => {
        this.model = new PaymentInstructionModel();
        this.model.assign(response.data);
        this.createForm();
      }, console.log);
  }

  getPaymentTypes(): void {
    this._paymentTypeService.getPaymentTypes()
      .then((response: IResponse) => this.paymentTypes = response.data.map(paymentType => ({ id: paymentType.id, name: paymentType.name })))
      .catch(console.log);
  }

  resetPaymentTypeFields() {
    this.paymentInstructionForm.removeControl('all_pay_transaction_id');
    delete this.model.all_pay_transaction_id;
    this.paymentInstructionForm.removeControl('authorization_code');
    delete this.model.authorization_code;
    this.paymentInstructionForm.removeControl('cheque_number');
    delete this.model.cheque_number;
    this.paymentInstructionForm.removeControl('postal_order_number');
    delete this.model.postal_order_number;
  }
  // ------------------------------------------------------------------------------------------
  onFormSubmission(e?): void {
    if (e) {
      e.preventDefault();
    }

    if (this.paymentInstructionForm.invalid) {
      console.error('Payment Instruction is not valid.');
      return;
    }

    // transform into model
    const model = _.chain(this.paymentInstructionForm.value)
      .keys()
      .forEach(key => this.model[key] = this.paymentInstructionForm.value[key])
      .value();

    const { type } = this._userService.getUser();

    this._paymentInstructionService
      .savePaymentInstruction(this.cleanModel)
      .subscribe((response: IResponse) => {
          // if this is an edit, redirect
          if (!response.data && response.success && this.loadedId) {
            return this._router.navigateByUrl( this.getPaymentInstructionListUrl );
          }

          // create a new payment instruction
          this.model = new PaymentInstructionModel();
          this.resetPaymentTypeFields();
          if (response.data) {
            this.model.assign(response.data);
            this.newDailySequenceId = _.assign(this.model.daily_sequence_id);
            this.newId = _.assign(this.model.id);
          }

          if ((response.data && response.data.status === PaymentStatus.DRAFT) && type === UserModel.TYPES.feeclerk.type) {
            this.model.status = PaymentStatus.PENDING;
            this.createForm();
            this.onFormSubmission();
          }
          this.model.resetData();
          this.paymentInstructionSuggestion = true;
      }, console.log);
  }

  onRouteParams(params): void {
    if (params.id && /[0-9]/.test(params.id)) {
      this.loadedId = params.id;
      this.getPaymentInstructionById(params.id);
      this.changePayment = (this._router.url.includes('/change-payment'));
    }
  }

  onSelectPaymentType(paymentType: IPaymentType) {
    this.resetPaymentTypeFields();

    switch (paymentType.id) {
      case 'cards':
        this.model.authorization_code = '';
        this.paymentInstructionForm.addControl('authorization_code', new FormControl(this.model.authorization_code, [
          Validators.required
        ]));
        break;

      case 'allpay':
        this.model.all_pay_transaction_id = '';
        this.paymentInstructionForm.addControl('all_pay_transaction_id', new FormControl(this.model.all_pay_transaction_id, [
          Validators.required
        ]));
        break;

      case 'cheques':
        this.model.cheque_number = '';
        this.paymentInstructionForm.addControl('cheque_number', new FormControl(this.model.cheque_number, [
          Validators.required
        ]));
        break;

      case 'postal-orders':
        this.model.postal_order_number = '';
        this.paymentInstructionForm.addControl('postal_order_number', new FormControl(this.model.postal_order_number, [
          Validators.required
        ]));
        break;
    }
  }
}
