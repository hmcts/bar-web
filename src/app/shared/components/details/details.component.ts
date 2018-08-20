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
import { forkJoin } from 'rxjs/observable/forkJoin';
import { upperFirst } from 'lodash';
import { IPaymentsLog } from '../../../core/interfaces/payments-log';
import { FormatPound } from '../../pipes/format-pound.pipe';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  bgcNumber: string;
  paymentType: string;
  status: string;
  toggleAll: boolean;
  userId: string;
  paymentInstructions$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject([]);

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentInstructionsService: PaymentInstructionsService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _location: Location) {
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
  // events based on clicks etc will go here ---------------------------------------------------------------------------------------
  onGoBack() {
    return this._location.back();
  }

  onSubmit(approve = true) {
    const savePaymentInstructionRequests = [];
    const checkAndSubmitModels = this.paymentInstructions$.getValue().filter(model => model.paymentId && model.checked);

    checkAndSubmitModels.forEach(model => {
      const paymentInstructionModel = this._paymentInstructionsService.transformIntoPaymentInstructionModel(model);
      paymentInstructionModel.status = PaymentStatus.getPayment(paymentInstructionModel.status).code;
      (!approve)
        ? savePaymentInstructionRequests.push(this._paymentsLogService.rejectPaymentInstruction(model.paymentId))
        : savePaymentInstructionRequests.push(this._paymentTypeService.savePaymentModel(paymentInstructionModel));
    });
    forkJoin(savePaymentInstructionRequests).subscribe(() => this.getPaymentInstructions(), console.log);
  }

  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.paymentInstructions$.getValue().forEach(model => model.checked = this.toggleAll);
  }

  onToggleChecked(paymentInstruction: CheckAndSubmit) {
    paymentInstruction.checked = !paymentInstruction.checked;
  }
}
