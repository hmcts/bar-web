import { Injectable } from '@angular/core';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentCaseReference} from '../../models/payment-parent.model';
import {ICaseFeeDetail} from '../../interfaces/payments-log';
import {FeeDetailModel} from '../../models/feedetail.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { Http } from '@angular/http';

@Injectable()
export class PaymentInstructionsService {

  constructor(private _http: Http) {}

  transformIntoPaymentInstructionModels(checkAndSubmitModels: CheckAndSubmit[]) {
    const paymentInstructionModels: PaymentInstructionModel[] = [];


    return paymentInstructionModels;
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: PaymentInstructionModel[]): CheckAndSubmit[]  {
    const models = [];
    console.log( paymentInstructions );
    paymentInstructions.forEach((paymentInstruction: PaymentInstructionModel) => {
      paymentInstruction.case_references.forEach((caseReference: PaymentCaseReference) => {
        caseReference.case_fee_details.forEach((fee: ICaseFeeDetail) => {
          const checkAndSubmitModel = new CheckAndSubmit();
          const feeModel = new FeeDetailModel();
          feeModel.assign(fee);
          checkAndSubmitModel.convertTo(paymentInstruction, feeModel);

          if (feeModel.remission_amount !== null || feeModel.refund_amount !== null) {
            console.log( feeModel );
          }

          if (models.find(model => model.paymentId === caseReference.payment_instruction_id)) {
            checkAndSubmitModel.removeDuplicateProperties();
          }
          models.push( checkAndSubmitModel );
        });
      });
    });

    return _.flattenDeep(models);
  }

  savePaymentInstruction(model: PaymentInstructionModel) {
    // console.log( model.paymentType );
    // this._http.post()
  }

}
