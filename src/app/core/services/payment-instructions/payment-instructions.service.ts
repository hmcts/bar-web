import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentCaseReference} from '../../models/payment-parent.model';
import {ICaseFeeDetail, IPaymentsLog} from '../../interfaces/payments-log';
import {FeeDetailModel} from '../../models/feedetail.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PaymentInstructionsService {

  constructor(private _http: HttpClient) {}

  transformIntoPaymentInstructionModel(checkAndSubmitModel: CheckAndSubmit): PaymentInstructionModel {
    const paymentInstructionModel: PaymentInstructionModel = new PaymentInstructionModel();
    paymentInstructionModel.id = checkAndSubmitModel.paymentId;
    paymentInstructionModel.payer_name = checkAndSubmitModel.name;
    paymentInstructionModel.amount = checkAndSubmitModel.paymentAmount;
    paymentInstructionModel.currency = 'GBP';
    paymentInstructionModel.payment_type = checkAndSubmitModel.paymentType;
    paymentInstructionModel.status = checkAndSubmitModel.status;
    return paymentInstructionModel;
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: IPaymentsLog[]): CheckAndSubmit[]  {
    const models = [];
    paymentInstructions.forEach((paymentInstruction: PaymentInstructionModel) => {
      paymentInstruction.case_fee_details.forEach((fee: ICaseFeeDetail) => {
        const checkAndSubmitModel = new CheckAndSubmit();
        const feeModel = new FeeDetailModel();
        feeModel.assign(fee);
        checkAndSubmitModel.convertTo(paymentInstruction, feeModel);

        if (feeModel.remission_amount !== null || feeModel.refund_amount !== null) {
          console.log( feeModel );
        }

        if (models.find(model => model.paymentId === feeModel.payment_instruction_id)) {
          checkAndSubmitModel.removeDuplicateProperties();
        }
        models.push( checkAndSubmitModel );
      });
    });

    return _.flattenDeep(models);
  }

  savePaymentInstruction(paymentInstructionModel: PaymentInstructionModel) {
    return this._http
      .post(`${environment.apiUrl}/payment/${paymentInstructionModel.payment_type.id}`, paymentInstructionModel);
  }

}
