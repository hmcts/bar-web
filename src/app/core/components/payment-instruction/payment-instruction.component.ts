import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { UserModel } from '../../models/user.model';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';

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
  paymentInstructionSuggestion = false;
  showModal = false;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    public location: Location,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => this.onRouteParams(params), err => console.log(err));
    this.getPaymentTypes();
  }

  get cleanModel(): PaymentInstructionModel {
    const model = new PaymentInstructionModel;
    Object.keys(this.model).forEach(key => (this.model[key] !== '') ? model[key] = this.model[key] : null);
    return model;
  }

  get hasPopulatedField(): boolean {
    return (Object.keys(this.model).filter(key => {
      if (key === 'currency' || key === 'unallocated_amount' || key === 'payment_type') {
        return false;
      }
      return this.model[key].length > 0;
    }).length > 0);
  }

  get window(): Window {
    return window;
  }

  getPaymentInstructionById(paymentID) {
    this._paymentInstructionService
      .getPaymentInstructionById(paymentID)
      .subscribe((response: IResponse) => this.model = response.data, err => console.log(err));
  }

  getPaymentTypes() {
    this._paymentTypeService.getPaymentTypes()
      .then((response: IResponse) => this.paymentTypes = response.data.map(paymentType => ({ id: paymentType.id, name: paymentType.name })))
      .catch(err => console.log(err));
  }
  // ------------------------------------------------------------------------------------------
  onFormSubmission(e?) {
    if (e) {
      e.preventDefault();
    }

    const { type } = this._userService.getUser();
    this._paymentInstructionService
      .savePaymentInstruction(this.cleanModel)
      .subscribe(
        (response: IResponse) => {
          this.model = new PaymentInstructionModel();
          this.model.assign(response.data);
          if ((response.data && response.data.status === PaymentStatus.DRAFT) && type === UserModel.TYPES.feeclerk.type) {
            this.model.status = PaymentStatus.PENDING;
            this.onFormSubmission();
          }
          this.paymentInstructionSuggestion = true;
        },
        err => console.log(err)
      );
  }

  onRouteParams(params) {
    if (params.id && /[0-9]/.test(params.id)) {
      this.getPaymentInstructionById(params.id);
      this.changePayment = (this._router.url.includes('/change-payment'));
    }
  }
}
