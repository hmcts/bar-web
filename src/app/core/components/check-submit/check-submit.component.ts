import { Component, OnInit } from '@angular/core';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {SearchModel} from '../../models/search.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {IResponse} from '../../interfaces';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService]
})
export class CheckSubmitComponent implements OnInit {
  checkAndSubmitModels = [];

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService) { }

  ngOnInit() {
    this.getPaymentInstructions();
  }

  get checked() {
    if (this.checkAndSubmitModels.length) {
      return this.checkAndSubmitModels.filter((model: CheckAndSubmit) => model.checked).length;
    }
    return 0;
  }

  getPaymentInstructions() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.status = PaymentStatus.VALIDATED;

    this._paymentsLogService
      .searchPaymentsByDate(searchModel)
      .then((response: IResponse) => this._paymentsInstructionService.transformIntoCheckAndSubmitModel(response.data))
      .then((models: CheckAndSubmit[]) => this.checkAndSubmitModels = models)
      .catch((err: IResponse) => console.log(err));
  }

  onSubmission() {}

  selectAll() {

  }

  togglePaymentInstruction(checkAndSubmitModel: CheckAndSubmit) {
    checkAndSubmitModel.checked = !checkAndSubmitModel.checked;
  }
}
