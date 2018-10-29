import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { SearchModel } from '../../models/search.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { IResponse } from '../../interfaces';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { UserService } from '../../../shared/services/user/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { IPaymentAction } from '../../interfaces/payment-actions';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentAction } from '../../models/paymentaction.model';
import { forkJoin } from 'rxjs';

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
  paymentInstructions$: Observable<PaymentInstructionModel[]>;
  pendingApprovalItems$: Observable<number>;
  selectedAction$: Observable<IPaymentAction> = this._paymentState.selectedPaymentAction$.asObservable();

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _paymentState: PaymentStateService,
    private _userService: UserService) {
  }

  ngOnInit() {
    this.paymentActions$ = this._paymentState.getPaymentActions();
    this.paymentInstructions$ = this.getPaymentInstructions(PaymentAction.PROCESS);
    this._paymentState.switchPaymentAction({ action: PaymentAction.PROCESS });
    this.pendingApprovalItems$ = this.getPaymentInstructionCounts();
  }

  getPaymentInstructions(action?: string): Observable<PaymentInstructionModel[]> {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;
    searchModel.action = action ? action : PaymentAction.PROCESS;
    return this._paymentsLogService.getPaymentsLogByUser(searchModel)
      .pipe(map((response: IResponse) => {
        return this._paymentsInstructionService.transformJsonIntoPaymentInstructionModels(response.data);
      }));
  }

  getPaymentInstructionCounts(): Observable<number> {
    const searchModel: SearchModel = new SearchModel();
    searchModel.userId = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.PENDINGAPPROVAL;
    return this._paymentsInstructionService
      .getCount(searchModel)
      .pipe(map((response: IResponse) => response.data));
  }

  switchPaymentInstructionsByAction(action: IPaymentAction) {
    this._paymentState.switchPaymentAction(action);
    this.paymentInstructions$ = this.getPaymentInstructions(action.action);
  }

  onSubmission(models: PaymentInstructionModel[]) {
    const paymentInstructionModels = models
      .map((paymentInstructionModel: PaymentInstructionModel) => {
        paymentInstructionModel.status = PaymentStatus.getPayment('Pending Approval').code;
        return this._paymentsInstructionService.savePaymentInstruction(paymentInstructionModel);
      });

    forkJoin(paymentInstructionModels).subscribe(() => {
      this._paymentState.switchPaymentAction({ action: PaymentAction.PROCESS });
      this.paymentInstructions$ = this.getPaymentInstructions(PaymentAction.PROCESS);
      this.pendingApprovalItems$ = this.getPaymentInstructionCounts();
      this.toggleAll = false;
    }, console.log);
  }
}
