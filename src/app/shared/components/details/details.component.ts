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
import { PaymentStatus } from '../../../core/models/paymentstatus.model';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  userId: string;
  status: string;
  paymentType: string;
  toggleAll: boolean;
  paymentInstructions$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject([]);

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentInstructionsService: PaymentInstructionsService,
    private _route: ActivatedRoute,
    private _location: Location) {
  }

  ngOnInit(): void {
    console.log(this._route);
    combineLatest(this._route.parent.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val.params && val.params.id) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
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
    searchModel.bgcNumber = '';
    this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .map((res: IResponse) => this._paymentInstructionsService.transformIntoCheckAndSubmitModels(res.data))
      .subscribe(data => this.paymentInstructions$.next(data));
  }
  // events based on clicks etc will go here ---------------------------------------------------------------------------------------
  onGoBack() {
    return this._location.back();
  }

  onReject() { }

  onSubmit() {
    const savePaymentInstructionRequests = [];
    const checkAndSubmitModels = this.paymentInstructions$.getValue().filter(model => model.paymentId && model.checked);
    checkAndSubmitModels.forEach(model => {
      const paymentInstructionModel = this._paymentInstructionsService.transformIntoPaymentInstructionModel(model);
      paymentInstructionModel.status = PaymentStatus.getPayment('Pending Approval').code;
      savePaymentInstructionRequests.push(this._paymentInstructionsService.savePaymentInstruction(paymentInstructionModel));
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
