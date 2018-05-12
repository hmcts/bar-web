import { Component, OnInit } from '@angular/core';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {SearchModel} from '../../models/search.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {IResponse} from '../../interfaces';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {UserService} from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.scss'],
  providers: [PaymentslogService, PaymentInstructionsService]
})
export class CheckSubmitComponent implements OnInit {
  checkAndSubmitModels: CheckAndSubmit[] = [];

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentsInstructionService: PaymentInstructionsService,
    private _userService: UserService) { }

  ngOnInit() {
    this.getPaymentInstructions();
  }

  get checked() {
    if (this.checkAndSubmitModels.length) {
      return this.checkAndSubmitModels.filter((model: CheckAndSubmit) => model.paymentId).length;
    }
    return 0;
  }

  getPaymentInstructions() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this._userService.getUser().id.toString();
    searchModel.status = PaymentStatus.VALIDATED;

    this._paymentsLogService
      .getPaymentsLogByUser(searchModel)
      .subscribe(
        (response: IResponse) => {
          this.checkAndSubmitModels = this._paymentsInstructionService.transformIntoCheckAndSubmitModel(response.data);
        },
        (err: IResponse) => console.log(err)
      );
  }

  onSubmission() {}

  selectAll() {
    this.checkAndSubmitModels.forEach(model => model.checked = !model.checked);
  }

  togglePaymentInstruction(checkAndSubmitModel: CheckAndSubmit) {
    checkAndSubmitModel.checked = !checkAndSubmitModel.checked;
  }
}
