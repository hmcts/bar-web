import {Component, OnInit} from '@angular/core';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {SearchModel} from '../../models/search.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {IResponse} from '../../interfaces';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {UserService} from '../../../shared/services/user/user.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {IPaymentAction} from '../../interfaces/payment-actions';
import {PaymentstateService} from '../../../shared/services/state/paymentstate.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService]
})
export class CheckSubmitComponent implements OnInit {
  numberOfItems: number;
  toggleAll = false;

  paymentActions$: Observable<IPaymentAction[]>;
  paymentInstructions$: Observable<CheckAndSubmit[]>;
  pendingApprovalItems$: Observable<number>;
  selectedAction$: Observable<IPaymentAction> = this._paymentState.selectedPaymentAction$.asObservable();

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _paymentState: PaymentstateService,
    private _userService: UserService) {
  }

  ngOnInit() {
    this.paymentActions$ = this._paymentState.getPaymentActions();
    this.paymentInstructions$ = this.getPaymentInstructions();
    this.pendingApprovalItems$ = this.getPaymentInstructionCounts();
  }

  getPaymentInstructions(): Observable<CheckAndSubmit[]> {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;
    return this._paymentsLogService.getPaymentsLogByUser(searchModel)
      .pipe(map((response: IResponse) => this._paymentsInstructionService
          .transformIntoCheckAndSubmitModels(response.data)));
  }

  getPaymentInstructionCounts() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.userId = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.PENDINGAPPROVAL;
    return this._paymentsInstructionService
      .getCount(searchModel)
      .pipe(map((response: IResponse) => response.data));
  }

  switchPaymentInstructionsByAction(action: IPaymentAction) {
    this._paymentState.switchPaymentAction(action);
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
        const piModel = this._paymentsInstructionService.transformIntoPaymentInstructionModel(model);
        piModel.status = PaymentStatus.PENDINGAPPROVAL;
        savePaymentInstructionRequests.push(this._paymentsInstructionService.savePaymentInstruction(piModel));
      });

      // ...and then capture the result of each of the requests
      forkJoin(savePaymentInstructionRequests).subscribe(results => {
        this.getPaymentInstructions();
        this.getPaymentInstructionCounts();
      }, console.log);
  }

  onToggleChecked(checkAndSubmitModel) {
    checkAndSubmitModel.checked = !checkAndSubmitModel.checked;
  }
}
