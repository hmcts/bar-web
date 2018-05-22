import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import 'rxjs/add/operator/switchMap';
import { PaymentStatus } from '../../models/paymentstatus.model';
import {UserModel} from '../../models/user.model';
import * as _ from 'lodash';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  providers: [PaymentInstructionsService, PaymentslogService, PaymenttypeService],
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentTypes: IPaymentType[] = [];
  showModal = false;
  newDataId = 0;
  changePayment = false;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private paymentTypeService: PaymenttypeService,
    private paymentLogService: PaymentslogService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.onRouteParams(params));
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

  getPaymentInstructionById(paymentID) {
    this.paymentLogService.getPaymentById(paymentID)
      .then((response: IResponse) => {
        this.model = response.data;
        this.model.payment_type = this.model.payment_type.id;
      })
      .catch(err => console.log(err));
  }

  getPaymentTypes() {
    this.paymentTypeService.getPaymentTypes()
      .then((response: IResponse) => this.paymentTypes = response.data.map(paymentType => ({ id: paymentType.id, name: paymentType.name })))
      .catch(err => console.log(err));
  }

  resetData() {
    if (!this.model.id) {
      this.model.amount = null;
      this.model.payer_name = '';
    }
    this.model.all_pay_transaction_id = '';
    this.model.authorization_code = '';
    this.model.cheque_number = '';
    this.model.postal_order_number = '';
  }

  // events go below here
  onFormSubmission(e?) {
    if (e) {
      e.preventDefault();
    }

    const { type } = this.userService.getUser();
    this._paymentInstructionService
      .savePaymentInstruction(this.cleanModel)
      .subscribe(
        (response: IResponse) => {
          console.log( response );
          if (
            (response.data.hasOwnProperty('status') && response.data.status === PaymentStatus.DRAFT) &&
            type === UserModel.TYPES.feeclerk.type
          ) {
            this.model = response.data;
            this.model.status = PaymentStatus.PENDING;
            this.onFormSubmission();
          }
          this.resetData();
        },
        err => console.log(err)
      );

    // this.paymentTypeService
    //   .savePaymentModel(this.model)
    //   .then(response => {
    //     this.resetData();

    //     if (response.data !== null) {
    //       this.newDataId = response.data.daily_sequence_id;
    //       if (typeof this.model.id === 'undefined') {
    //         this.showModal = true;

    //         if (type === UserModel.TYPES.feeclerk.type) {
    //           this.model = response.data;
    //           this.model.status = PaymentStatus.PENDING;
    //           this.onFormSubmission();
    //           return;
    //         }
    //       }
    //     }

    //     if (type === UserModel.TYPES.feeclerk.type) {
    //       return this.router.navigateByUrl(`/feelog/edit/${this.model.id}`);
    //     }
    //     return this.router.navigateByUrl('/paymentslog');
    //   })
    // .catch(err => console.log(err));
  }

  onRouteParams(params) {
    if (params.id && /[0-9]/.test(params.id)) {
      this.getPaymentInstructionById(params.id);
      this.changePayment = (this.router.url.includes('/change-payment'));
    }
  }

  onToggleShowModal() {
    this.showModal = false;
    this.newDataId = 0;
  }
}
