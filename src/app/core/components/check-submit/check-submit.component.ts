import {Component, OnInit} from '@angular/core';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {SearchModel} from '../../models/search.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {IResponse} from '../../interfaces';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {UserService} from '../../../shared/services/user/user.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService]
})
export class CheckSubmitComponent implements OnInit {
  checkAndSubmitModels$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject<CheckAndSubmit[]>([]);
  numberOfItems: number;
  pendingApprovalItems: number;
  toggleAll = false;

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _userService: UserService) {
  }

  ngOnInit() {
    this.getPaymentInstructions();
  }

  getPaymentInstructions() {
    const searchModel: SearchModel = new SearchModel();
    const format = require('date-format');
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;

    this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .pipe(
        take(1),
        map((response: IResponse) => this._paymentsInstructionService.transformIntoCheckAndSubmitModels(response.data))
      )
      .subscribe(data => {
        this.numberOfItems = data.filter(model => model.paymentId !== null).length;
        this.checkAndSubmitModels$.next(data);
      });

    searchModel.status = PaymentStatus.PENDINGAPPROVAL;
    searchModel.startDate = format.asString('ddMMyyyy', new Date());
    this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .pipe(
        take(1),
        map((response: IResponse) => this._paymentsInstructionService.transformIntoCheckAndSubmitModels(response.data))
      )
      .subscribe(data => {
        this.pendingApprovalItems = data.filter(model => model.paymentId !== null).length;
      });


  }

  // events based on clicks etc will go here ---------------------------------------------------------------------------------------
  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.checkAndSubmitModels$.subscribe(data$ => data$.forEach(model => model.checked = this.toggleAll));
  }

  onSubmission() {
    const savePaymentInstructionRequests = [];
    const checkAndSubmitModels = this.checkAndSubmitModels$.getValue().filter(model => model.paymentId && model.checked);

    // loop through the check and submit models
    checkAndSubmitModels.forEach(model => {
      this._paymentsInstructionService.transformIntoPaymentInstructionModel(model)
        .then(paymentInstructionModel => {
          paymentInstructionModel.status = PaymentStatus.PENDINGAPPROVAL;
          savePaymentInstructionRequests.push(this._paymentsInstructionService.savePaymentInstruction(paymentInstructionModel));
        })
        .then(() => Promise.all(savePaymentInstructionRequests)
          .then(values => this.getPaymentInstructions())
          .catch(console.log)
        );
    });
  }

  onToggleChecked(checkAndSubmitModel) {
    checkAndSubmitModel.checked = !checkAndSubmitModel.checked;
  }
}
