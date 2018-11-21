import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { SearchModel } from '../../../core/models/search.model';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from '../../../core/interfaces';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';
import { first, isUndefined, upperFirst } from 'lodash';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../core/models/user.model';
import { PaymentType } from '../../models/util/model.utils';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentAction } from '../../../core/models/paymentaction.model';
import { IPaymentAction } from '../../../core/interfaces/payment-actions';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  @Input() searchQuery: string;
  @Input() action: IPaymentAction;
  @Output() onSuccessfulSave = new EventEmitter<any>();
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
    this.paymentType = this.getUrlParams(this.searchQuery)['paymentType'];
    combineLatest(this._route.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val.params && val.params.id) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.getPaymentInstructions();
        }
      });
  }

  get userType() {
    return this._user.getUser().type;
  }

  getPaymentInstructions(): void {
    this._paymentsLogService
      .getPaymentsLogs(this.userId, this.searchQuery)
      .pipe(map((res: IResponse) => this._paymentInstructionsService.transformIntoCheckAndSubmitModels(res.data)))
      .subscribe(data => {
        this.paymentInstructions$.next(data);
        if (first(this.paymentInstructions$.getValue())) {
          const siteId = first(this.paymentInstructions$.getValue()).siteId;
          this.siteCode = siteId.substr(-2, 2);
        }
      });
  }

  getPaymentType() {
    return this.paymentType.split(',')
      .map(paymentTypeName => paymentTypeName.toLowerCase().replace('_', ' '))
      .join(' & ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getTotal(paymentInstructions: BehaviorSubject<CheckAndSubmit[]>) {
    return paymentInstructions.getValue()
      .reduce((accumulator, current) => accumulator + current.paymentAmount, 0);
  }

  needsBgcNumber(type: string) {
    if (this._user.getUser().type !== UserModel.TYPES.seniorfeeclerk.type) { // user must be a senior fee clerk
      return false;
    }
    if (this.action.action !== PaymentAction.PROCESS) {
      return false;
    }
    return this.bgcTypes.includes(type);
  }

  sendPaymentInstructions(paymentInstructions: Array<CheckAndSubmit>): void {
    const requests = paymentInstructions
    .filter(model => model.paymentId !== null)
    .map(model => {
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
      this.onSuccessfulSave.emit('refresh');
    }, console.log);
  }

  // events based on clicks etc will go here ---------------------------------------------------------------------------------------
  onGoBack() {
    return this._location.back();
  }

  onSubmit(approve = true) {
    this.approved = approve;
    const checkAndSubmitModels = this.paymentInstructions$
      .getValue()
      .filter(model => model.paymentId && model.checked);

    if (checkAndSubmitModels.length < 1) return false;

    if (this.needsBgcNumber(this.paymentType) && this.approved) {
      this.toggleModal = !this.toggleModal;
    } else {
      this.sendPaymentInstructions(checkAndSubmitModels);
    }
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
    this.toggleAll = this.paymentInstructions$.getValue().every(item => item.checked);
  }

  private promote(pi: PaymentInstructionModel): PaymentInstructionModel {
    const statuses = [
      PaymentStatus.getPayment('Pending Approval').code,
      PaymentStatus.getPayment('Approved').code,
      PaymentStatus.getPayment('Transferred To Bar').code,
      PaymentStatus.getPayment('Completed').code
    ];
    const actions = [PaymentAction.WITHDRAW, PaymentAction.RETURNS];
    pi.status = PaymentStatus.getPayment(pi.status).code;
    const statusIndex = statuses.findIndex(status => status === pi.status);
    const actionIndex = actions.findIndex(action => action === pi.action);
    if (statusIndex > -1) {
      if (actionIndex > -1) {
        pi.status = PaymentStatus.getPayment('Completed').code;
      } else {
        pi.status = statuses[statusIndex + 1]
          ? statuses[statusIndex + 1]
          : pi.status;
      }
    }
    return pi;
  }

  private getUrlParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    const params = {};
    hashes.map(hash => {
        const [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val);
    });

    return params;
}
}
