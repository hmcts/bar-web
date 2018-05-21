import { TestBed, inject } from '@angular/core/testing';

import { FeelogService } from './feelog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FeeDetailModel} from '../../models/feedetail.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { CaseFeeDetailModel } from '../../models/casefeedetail';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';

describe('FeelogService', () => {
  let feelogService: FeelogService;
  let http: HttpClient;

  beforeEach(() => {
    http = instance(mock(HttpClient));
    feelogService = new FeelogService(http);
  });

  it('calculate unallocated amount when fee is in edit mode', () => {
    const feeLogModel = new PaymentInstructionModel();
    feeLogModel.unallocated_amount = 50000;

    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.amount = 500;
    feeDetailModel.remission_amount = 300;
    feeDetailModel.refund_amount = 100;
    expect(feelogService.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(200);

    feeLogModel.unallocated_amount = 30000;
    expect(feelogService.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(0);

  });

  it ('getFeeLog', () => {
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });

    feelogService.getFeeLog('P');
    expect(calledWithParam).toBe('http://localhost:3000/api/payments-instructions?status=P');
  });

  it('getFeeCodesAndDescriptions', () => {
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });

    feelogService.getFeeCodesAndDescriptions('x12');
    expect(calledWithParam).toBe('http://localhost:3000/api/fees/search?code=x12');

  });

  it('addFeeToCase', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1, param2) => {
      calledWithParams[0] = param1;
      calledWithParams[1] = param2;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const casefeeDetail = new CaseFeeDetailModel();
    casefeeDetail.amount = 100;
    feelogService.addEditFeeToCase('1', casefeeDetail, 'post');
    expect(calledWithParams[0]).toBe('http://localhost:3000/api/payment-instructions/1/fees');
    expect(calledWithParams[1].amount).toBe(100);
  });

  it('sendPaymentInstructionAction', () => {
    const calledWithParams = [];
    spyOn(http, 'patch').and.callFake((param1, param2) => {
      calledWithParams[0] = param1;
      calledWithParams[1] = param2;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const pi = new PaymentInstructionModel();
    pi.id = 1;
    const piAction = new PaymentInstructionActionModel();
    piAction.action = 'action';
    feelogService.sendPaymentInstructionAction(pi, piAction);
    expect(calledWithParams[0]).toBe('http://localhost:3000/api/payment-instructions/1');
    expect(calledWithParams[1]).toBe(piAction);
  });

  it('updatePaymentModel', () => {
    const calledWithParams = [];
    spyOn(http, 'patch').and.callFake((param1, param2) => {
      calledWithParams[0] = param1;
      calledWithParams[1] = param2;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const pi = new PaymentInstructionModel();
    pi.id = 1;
    feelogService.updatePaymentModel(pi);
    expect(calledWithParams[0]).toBe('http://localhost:3000/api/payment-instructions/1');
    expect(calledWithParams[1]).toBe(pi);
  });

  it('removeFeeFromPaymentInstruction', () => {
    let calledWithParam;
    spyOn(http, 'delete').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const casefeeDetail = new CaseFeeDetailModel();
    casefeeDetail.case_fee_id = 1;
    feelogService.removeFeeFromPaymentInstruction(casefeeDetail);
    expect(calledWithParam).toBe('http://localhost:3000/api/fees/1');

  });

});
