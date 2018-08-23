import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { SearchModel } from '../../../core/models/search.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from '../../../core/interfaces';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { upperFirst } from 'lodash';
import { FormatPound } from '../../pipes/format-pound.pipe';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  approved = false;
  bgcTypes = ['cheques,postal-orders', 'cash'];
  statuses = [
    PaymentStatus.getPayment('Pending Approval').code,
    PaymentStatus.getPayment('Approved').code,
    PaymentStatus.getPayment('Transferred To Bar').code
  ];
  bgcNumber: string;
  bgcPaymentInstructions = [];
  toggleModal = false;
  paymentType: string;
  savePaymentInstructionRequests = [];
  status: string;
  toggleAll: boolean;
  userId: string;
  paymentInstructions$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject([]);

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentInstructionsService: PaymentInstructionsService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _user: UserService) {
  }

  ngOnInit(): void {
    combineLatest(this._route.parent.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val.params && val.params.id) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.bgcNumber = val.qparams.bgcNumber;
          this.paymentType = val.qparams.paymentType;
          this.getPaymentTypesList();
          this.getPaymentInstructions();
        }
      });
  }

  get userType() {
    return this._user.getUser().type;
  }

  getPaymentInstructions(): void {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this.userId;
    searchModel.status = this.status;
    searchModel.paymentType = this.paymentType;
    searchModel.bgcNumber = this.bgcNumber;

    this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .map((res: IResponse) => this._paymentInstructionsService.transformIntoCheckAndSubmitModels(res.data))
      .subscribe(data => this.paymentInstructions$.next(data));
  }

  getPaymentTypesList() {
    this._paymentTypeService
      .getPaymentTypes()
      .then(paymentTypes => this._paymentTypeService.setPaymentTypeList(paymentTypes.data))
      .catch(console.log);
  }

  getPaymentAmount(paymentInstruction: CheckAndSubmit) {
    const formatter = new FormatPound('GBP');
    return (paymentInstruction.paymentAmount)
      ? formatter.transform(`${paymentInstruction.paymentAmount}`)
      : '';
  }

  getPaymentType(paymentType: string) {
    return paymentType.split(',')
      .map(paymentTypeName => upperFirst(paymentTypeName))
      .join(' & ');
  }

  getTotal(paymentInstructions: BehaviorSubject<CheckAndSubmit[]>) {
    return paymentInstructions.getValue()
      .reduce((accumulator, current) => accumulator + current.paymentAmount, 0);
  }

  needsBgcNumber(type: string) {
    return this._user.getUser().type === UserModel.TYPES.seniorfeeclerk.type // user must be a senior fee clerk
      ? this.bgcTypes.includes(type)
      : false;
  }

  async sendPaymentInstructions(paymentInstructions: Array<CheckAndSubmit>) {
    const requests = []; // array to hold all the requests...
    let i;
    for (i = 0; i < paymentInstructions.length; i++) {
      const model = paymentInstructions[i];
      const paymentInstructionModel = await this._paymentInstructionsService.transformIntoPaymentInstructionModel(model);
      paymentInstructionModel.status = PaymentStatus.getPayment(paymentInstructionModel.status).code;

      const index = this.statuses.findIndex(status => status === paymentInstructionModel.status);
      if (index > -1) {
        paymentInstructionModel.status = this.statuses[index + 1]
          ? this.statuses[index + 1]
          : paymentInstructionModel.status;
      }

      (!this.approved)
        ? requests.push(this._paymentsLogService.rejectPaymentInstruction(paymentInstructionModel.id).toPromise())
        : requests.push(this._paymentTypeService.savePaymentModel(paymentInstructionModel));
    }

    Promise.all(requests) // after all requests have been made, "then"
      .then(() => {
        this.toggleModal = false;
        this.bgcNumber = undefined;
        this.approved = false;
        this.toggleAll = false;
        this.getPaymentInstructions();
      })
      .catch(console.log);
  }

  // events based on clicks etc will go here ---------------------------------------------------------------------------------------

  onGoBack() {
    return this._location.back();
  }

  onSubmit(approve = true) {
    this.approved = approve;
    const checkAndSubmitModels = this.paymentInstructions$.getValue().filter(model => model.paymentId && model.checked);
    if (checkAndSubmitModels.length < 1) return false;

    this.needsBgcNumber(this.paymentType)
      ? this.toggleModal = !this.toggleModal
      : this.sendPaymentInstructions(checkAndSubmitModels);
  }

  onBgcSubmit() {
    const paymentInstructions = this.paymentInstructions$
      .getValue()
      .filter(model => model.checked)
      .map(model => {
        model.bgcNumber = this.bgcNumber;
        return model;
      });

    return this.sendPaymentInstructions(paymentInstructions);
  }

  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.paymentInstructions$.getValue().forEach(model => model.checked = this.toggleAll);
  }

  onToggleChecked(paymentInstruction: CheckAndSubmit) {
    paymentInstruction.checked = !paymentInstruction.checked;
  }
}
