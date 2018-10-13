
import {Injectable} from '@angular/core';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {ICaseFeeDetail, IPaymentsLog} from '../../interfaces/payments-log';
import {FeeDetailModel} from '../../models/feedetail.model';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {BarHttpClient} from '../../../shared/services/httpclient/bar.http.client';
import {isUndefined} from 'lodash';
import {PaymentStateService} from '../../../shared/services/state/paymentstate.service';
import {SearchModel} from '../../models/search.model';
import { mergeMap } from 'rxjs/operators';
import { PaymentTypeEnum } from '../../models/payment.type.enum';

@Injectable()
export class PaymentInstructionsService {
  constructor(private _http: BarHttpClient,
              private _PaymentStateService: PaymentStateService) {}

  getPaymentInstructions(status?: PaymentStatus[]): Observable<any> {
    let params = '';
    if (typeof status !== 'undefined') {
      params = `?status=${status.join(',')}`;
    }
    return this._http.get(
      `/api/payment-instructions${params}`
    );
  }

  savePaymentInstruction(paymentInstructionModel: PaymentInstructionModel): Observable<any> {
    return this._http.post(`/api/payment/` +
      this._PaymentStateService.paymentTypeEnum.getValue().getEndpointUri(paymentInstructionModel.payment_type.id),
        paymentInstructionModel);
  }

  getPaymentInstructionById(id: number): Observable<any> {
    return this._http.get(`/api/payment-instructions/${id}`);
  }

  getCount(searchModel: SearchModel) {
    return this._http
      .get(`${environment.apiUrl}/payment-instructions/count?userId=${searchModel.userId}&status=${searchModel.status}`);
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: IPaymentsLog[]): CheckAndSubmit[] {
    const models = [];

    paymentInstructions.forEach((paymentInstruction: PaymentInstructionModel) => {
      if (paymentInstruction.case_fee_details.length < 1) {
        const checkAndSubmitModel = new CheckAndSubmit();
        checkAndSubmitModel.convertTo(paymentInstruction);
        models.push(checkAndSubmitModel);
        return;
      }

      paymentInstruction.case_fee_details.forEach((fee: ICaseFeeDetail) => {
        const checkAndSubmitModel = new CheckAndSubmit();
        const feeModel = new FeeDetailModel();
        feeModel.assign(fee);
        checkAndSubmitModel.convertTo(paymentInstruction, feeModel);

        if (feeModel.remission_amount !== null || feeModel.refund_amount !== null) {
          console.log(feeModel);
        }

        if (models.find(model => model.paymentId === feeModel.payment_instruction_id)) {
          checkAndSubmitModel.removeDuplicateProperties();
        }
        models.push(checkAndSubmitModel);
      });
    });
    return models;
  }

  // TODO: Revisit this, as the amount is not correct (become formatted string in payment instruction)
  transformIntoPaymentInstructionModel(checkAndSubmitModel: CheckAndSubmit): PaymentInstructionModel {
    const paymentInstructionModel: PaymentInstructionModel = new PaymentInstructionModel();
    paymentInstructionModel.id = checkAndSubmitModel.paymentId;
    paymentInstructionModel.payer_name = checkAndSubmitModel.name;
    paymentInstructionModel.amount = checkAndSubmitModel.paymentAmount;
    paymentInstructionModel.currency = 'GBP';
    paymentInstructionModel.payment_type = checkAndSubmitModel.paymentType;
    paymentInstructionModel.status = checkAndSubmitModel.status;

    if (!isUndefined(checkAndSubmitModel.bgcNumber)) {
      paymentInstructionModel.bgc_number = checkAndSubmitModel.bgcNumber;
    }

    const paymentTypeEnum = this._PaymentStateService.paymentTypeEnum;
    switch (paymentInstructionModel.payment_type.id) {
      case paymentTypeEnum.getValue().CHEQUE:
        paymentInstructionModel.cheque_number = checkAndSubmitModel.chequeNumber;
        break;
      case paymentTypeEnum.getValue().POSTAL_ORDER:
        paymentInstructionModel.postal_order_number = checkAndSubmitModel.postalOrderNumber;
        break;
      case paymentTypeEnum.getValue().ALLPAY:
        paymentInstructionModel.all_pay_transaction_id = checkAndSubmitModel.allPayTransactionId;
        break;
      case paymentTypeEnum.getValue().CARD:
        paymentInstructionModel.authorization_code = checkAndSubmitModel.authorizationCode;
        break;
    }
    return paymentInstructionModel;
  }

  transformJsonIntoPaymentInstructionModels(data): PaymentInstructionModel[] {
    const models: PaymentInstructionModel[] = [];
    data.forEach((payment: IPaymentsLog) => {
      const paymentInstruction = new PaymentInstructionModel();
      paymentInstruction.assign(payment);
      paymentInstruction.selected = false;
      models.push(paymentInstruction);
    });
    return models;
  }
}
