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
import * as moment from 'moment';
import { CheckAndSubmit } from '../../models/check-and-submit';
import { ICheckAndSubmit } from '../../interfaces/check-and-submit';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService, PaymentsOverviewService]
})
export class CheckSubmitComponent implements OnInit {
  numberOfItems: number;
  toggleAll = false;

  paymentActions$: Observable<IPaymentAction[]>;
  paymentInstructions$: Observable<PaymentInstructionModel[]> | Observable<CheckAndSubmit[]>;
  pendingApprovalItems$: Observable<number>;
  selectedAction$: Observable<IPaymentAction> = this._paymentState.selectedPaymentAction$.asObservable();
  paymentInstructionsPending$: Observable<number>;
  actionStats$: Observable<any>;
  userId: string;

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _paymentState: PaymentStateService,
    private _userService: UserService,
    private _paymentOverviewService: PaymentsOverviewService) {
  }

  ngOnInit() {
    this.userId = this._userService.getUser().id.toString();
    this.actionStats$ = this._paymentOverviewService
      .getPaymentStatsByUserAndStatus(this.userId, PaymentStatus.VALIDATED)
      .pipe(map((resp: IResponse) => {
        delete resp.data._links;
        return resp.data;
      }));
    this.paymentActions$ = this._paymentState.getPaymentActions();
    this.paymentInstructions$ = this.getPaymentInstructions(PaymentAction.PROCESS);
    this._paymentState.switchPaymentAction({ action: PaymentAction.PROCESS });
    this.pendingApprovalItems$ = this.getPaymentInstructionCounts();
    this.paymentInstructionsPending$ = this.getPendingPaymentInstructions();
  }

  getPendingPaymentInstructions() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;
    return this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .pipe(
        map((response: IResponse) => response.data.length)
      );
  }

  getPaymentInstructions(action?: string): Observable<PaymentInstructionModel[]> | Observable<CheckAndSubmit[]> {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;
    searchModel.action = action ? action : PaymentAction.PROCESS;
    return this._paymentsLogService.getPaymentsLogByUser(searchModel).pipe(
      map((response: IResponse) => {
        return this._paymentsInstructionService.transformJsonIntoPaymentInstructionModels(response.data);
      }),
      map((paymentInstructions: PaymentInstructionModel[]) => {
        return this._paymentsInstructionService.transformIntoCheckAndSubmitModels(paymentInstructions);
      })
    );
  }

  getPaymentInstructionCounts(): Observable<number> {
    const searchModel: SearchModel = new SearchModel();
    searchModel.userId = this._userService.getUser().id.toString();
    searchModel.startDate = moment().format();
    searchModel.endDate = moment().format();
    searchModel.status = PaymentStatus.PENDINGAPPROVAL;
    return this._paymentsInstructionService
      .getCount(searchModel)
      .pipe(map((response: IResponse) => response.data));
  }

  switchPaymentInstructionsByAction(action: IPaymentAction) {
    this._paymentState.switchPaymentAction(action);
    this.paymentInstructions$ = this.getPaymentInstructions(action.action);
  }

  onSubmission(models: ICheckAndSubmit[]) {
    const paymentInstructionModels = models
      // only way to check if this is a checkandsubmit model
      // in this case, if it is, then transform back to a payment instruction model
      .filter(model => !!model.paymentId)
      .map((paymentInstructionModel: any) => {
        paymentInstructionModel = this._paymentsInstructionService.transformIntoPaymentInstructionModel(paymentInstructionModel);
        paymentInstructionModel.status = PaymentStatus.getPayment('Pending Approval').code;
        return this._paymentsInstructionService.savePaymentInstruction(paymentInstructionModel);
      });

    forkJoin(paymentInstructionModels).subscribe(() => {
      this.selectedAction$.subscribe(action => {
        this.paymentInstructions$ = this.getPaymentInstructions(action.action);
      });
      this.pendingApprovalItems$ = this.getPaymentInstructionCounts();
      this.paymentInstructionsPending$ = this.getPendingPaymentInstructions();
      this.toggleAll = false;
      this._paymentOverviewService.getPaymentStatsByUserAndStatus(this.userId, PaymentStatus.VALIDATED)
        .pipe(map((resp: IResponse) => {
          delete resp.data._links;
          return resp.data;
        }));
    }, console.log);
  }
}
