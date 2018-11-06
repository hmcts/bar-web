import {FeeDetailModel} from '../models/feedetail.model';
import { ICaseFeeDetail } from '../interfaces/payments-log';
import { PaymentInstructionModel } from '../models/paymentinstruction.model';
import { PaymentInstructionActionModel } from '../models/payment-instruction-action.model';

const feeSearchResult = `{"found": "true", "fees": [
   {
      "code":"FEE0001",
      "fee_type":"fixed",
      "channel_type":{
         "name":"default"
      },
      "event_type":{
         "name":"issue"
      },
      "jurisdiction1":{
         "name":"civil"
      },
      "jurisdiction2":{
         "name":"county court"
      },
      "service_type":{
         "name":"civil money claims"
      },
      "applicant_type":{
         "name":"all"
      },
      "fee_versions":[
         {
            "version":1,
            "valid_from":"2014-04-22T00:00:00.000+0000",
            "description":"Civil Court fees - Money Claims - Claim Amount - Unspecified",
            "status":"approved",
            "flat_amount":{
               "amount":10000.00
            },
            "memo_line":"GOV - Paper fees - Money claim >£200,000",
            "natural_account_code":"4481102133",
            "direction":"enhanced"
         }
      ],
      "current_version":{
         "version":1,
         "valid_from":"2014-04-22T00:00:00.000+0000",
         "description":"Civil Court fees - Money Claims - Claim Amount - Unspecified",
         "status":"approved",
         "flat_amount":{
            "amount":10000.00
         },
         "memo_line":"GOV - Paper fees - Money claim >£200,000",
         "natural_account_code":"4481102133",
         "direction":"enhanced"
      },
      "unspecified_claim_amount":true
   },
   {
      "code":"FEE0002",
      "fee_type":"fixed",
      "channel_type":{
         "name":"default"
      },
      "event_type":{
         "name":"issue"
      },
      "jurisdiction1":{
         "name":"family"
      },
      "jurisdiction2":{
         "name":"family court"
      },
      "service_type":{
         "name":"divorce"
      },
      "applicant_type":{
         "name":"all"
      },
      "fee_versions":[
         {
            "version":4,
            "valid_from":"2016-03-21T00:00:00.000+0000",
            "description":"Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.",
            "status":"approved",
            "flat_amount":{
               "amount":550.00
            },
            "memo_line":"GOV - App for divorce/nullity of marriage or CP",
            "statutory_instrument":"2016 No. 402 (L. 5)",
            "si_ref_id":"1.2",
            "natural_account_code":"4481102159",
            "fee_order_name":"The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
            "direction":"enhanced"
         }
      ],
      "current_version":{
         "version":4,
         "valid_from":"2016-03-21T00:00:00.000+0000",
         "description":"Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.",
         "status":"approved",
         "flat_amount":{
            "amount":550.00
         },
         "memo_line":"GOV - App for divorce/nullity of marriage or CP",
         "statutory_instrument":"2016 No. 402 (L. 5)",
         "si_ref_id":"1.2",
         "natural_account_code":"4481102159",
         "fee_order_name":"The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
         "direction":"enhanced"
      },
      "unspecified_claim_amount":false
   }]}`;

export class FeelogServiceMock {

  getFeeCodesAndDescriptions(query: string, jurisdiction1: string, jurisdiction2: string): Promise<any> {
    if (query) {
      return new Promise(resolve => resolve(JSON.parse(feeSearchResult)));
    }
    return new Promise(resolve => resolve([]));
  }

  addEditFeeToCase(paymentInstructionId: string, data: FeeDetailModel, method = 'post'): Promise<any> {
    return new Promise(resolve => resolve({}));
  }

  removeFeeFromPaymentInstruction(caseFeeDetail: ICaseFeeDetail): Promise<any> {
    return Promise.resolve();
  }

  sendPaymentInstructionAction(
    model: PaymentInstructionModel,
    paymentInstructionActionModel: PaymentInstructionActionModel
  ) {
    return Promise.resolve({ success: true });
  }

  updatePaymentModel(model: PaymentInstructionModel) {
    return Promise.resolve({  });
  }

  getFeeJurisdictions(query: string) {
    const jurisdictionsArray = [{name: 'civil'}, {name: 'civil1'}, {name: 'civil2'}];
    return Promise.resolve({ found: true, jurisdictions: jurisdictionsArray, success: true });
  }
}
