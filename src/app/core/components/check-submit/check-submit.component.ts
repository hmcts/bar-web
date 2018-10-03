import {Component, OnInit} from '@angular/core';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {SearchModel} from '../../models/search.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {IResponse} from '../../interfaces';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {UserService} from '../../../shared/services/user/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, take, concatAll, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService]
})
export class CheckSubmitComponent implements OnInit {
  checkAndSubmitModels$: BehaviorSubject<CheckAndSubmit[]> = new BehaviorSubject<CheckAndSubmit[]>([]);
  numberOfItems: number;
  toggleAll = false;
  selectAll = false;


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
  }

  // events based on clicks etc will go here ---------------------------------------------------------------------------------------

  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.checkAndSubmitModels$.getValue().forEach(model => model.checked = this.toggleAll);
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
    }, console.log);
  }

  onToggleChecked(checkAndSubmitModel: CheckAndSubmit) {
    checkAndSubmitModel.checked = !checkAndSubmitModel.checked;
    this.toggleAll = (this.checkAndSubmitModels$.getValue().every(model => model.checked === true)) ? true : false;
  }
}
