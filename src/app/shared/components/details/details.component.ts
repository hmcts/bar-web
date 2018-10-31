import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { SearchModel } from '../../../core/models/search.model';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from '../../../core/interfaces';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';
import { first, upperFirst } from 'lodash';
import { FormatPound } from '../../pipes/format-pound.pipe';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../core/models/user.model';
import { PaymentType } from '../../models/util/model.utils';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  approved = false;
  bgcTypes = [`${PaymentType.CHEQUE},${PaymentType.POSTAL_ORDER}`, PaymentType.CASH];
  bgcNumber: string;
  bgcPaymentInstructions = [];
  paymentInstructions$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject([]);
  paymentType: string;
  savePaymentInstructionRequests = [];
  siteCode: string;
  status: string;
  toggleAll: boolean;
  toggleModal = false;
  userId: string;

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
      .pipe(map((res: IResponse) => this._paymentInstructionsService.transformIntoCheckAndSubmitModels(res.data)))
      .subscribe(data => {
        this.paymentInstructions$.next(data);
        const siteId = first(this.paymentInstructions$.getValue()).siteId;
        this.siteCode = siteId.substr(-2, 2);
      });
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

  sendPaymentInstructions(paymentInstructions: Array<CheckAndSubmit>): void {
    const requests = paymentInstructions.map(model => {
      const piModel = this._paymentInstructionsService.transformIntoPaymentInstructionModel(model);
      this.promote(piModel);
      if (this.approved) {
        return this._paymentTypeService.savePaymentModel(piModel);
      } else {
        return this._paymentsLogService.rejectPaymentInstruction(piModel.id);
      }
    });

    forkJoin(requests).subscribe(results => {
      this.toggleModal = false;
      this.bgcNumber = undefined;
      this.approved = false;
      this.toggleAll = false;
      this.getPaymentInstructions();
    }, console.log);
  }

  // events based on clicks etc will go here ---------------------------------------------------------------------------------------
  onGoBack() {
    return this._location.back();
  }

  onSubmit(approve = true) {
    this.approved = approve;
    const checkAndSubmitModels = this.paymentInstructions$.getValue().filter(model => model.paymentId && model.checked);
    if (checkAndSubmitModels.length < 1) return false;

    if (this.needsBgcNumber(this.paymentType) && this.approved) {
      this.toggleModal = !this.toggleModal;
    } else {
      this.sendPaymentInstructions(checkAndSubmitModels);
      location.reload();
    }
/*
    this.needsBgcNumber(this.paymentType)
      ? this.toggleModal = !this.toggleModal
      : this.sendPaymentInstructions(checkAndSubmitModels);*/
  }

  onBgcSubmit() {
    const paymentInstructions = this.paymentInstructions$
      .getValue()
      .filter(model => model.checked)
      .map(model => {
        model.bgcNumber = this.siteCode.concat(this.bgcNumber);
        return model;
      });

    return this.sendPaymentInstructions(paymentInstructions);
  }

  onCancelBgcNumber() {
    this.bgcNumber = undefined;
    this.toggleModal = false;
  }

  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.paymentInstructions$.getValue().forEach(model => model.checked = this.toggleAll);
  }

  onToggleChecked(paymentInstruction: CheckAndSubmit) {
    paymentInstruction.checked = !paymentInstruction.checked;
  }

  private promote(pi: PaymentInstructionModel): PaymentInstructionModel {
    const statuses = [
      PaymentStatus.getPayment('Pending Approval').code,
      PaymentStatus.getPayment('Approved').code,
      PaymentStatus.getPayment('Transferred To Bar').code
    ];
    pi.status = PaymentStatus.getPayment(pi.status).code;
    const index = statuses.findIndex(status => status === pi.status);
    if (index > -1) {
      pi.status = statuses[index + 1]
        ? statuses[index + 1]
        : pi.status;
    }
    return pi;
  }
}
