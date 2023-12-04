import { TestBed, inject } from '@angular/core/testing';

import { FeelogService } from './feelog.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FeeDetailModel} from '../../models/feedetail.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { CaseFeeDetailModel } from '../../models/casefeedetail';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Meta } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FeelogService', () => {
  let feelogService: FeelogService;
  let http: BarHttpClient;
  let httpSpy: BarHttpClient;

  // beforeEach(() => {
  //   http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
  //   feelogService = new FeelogService(http);
  // });

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//         imports: [HttpClientTestingModule],
//         providers: [FeelogService, BarHttpClient]
//     });

//     feelogService = TestBed.inject(FeelogService);
//     http = TestBed.inject(BarHttpClient);
// });

beforeEach(() => {

  httpSpy = jasmine.createSpyObj(BarHttpClient);

  TestBed.configureTestingModule({
    providers: [
      FeelogService,
      { provide: HttpClient, useValue: httpSpy}
    ]
  });
  
  feelogService = TestBed.inject(FeelogService);
  httpSpy = TestBed.inject<any>(HttpClient);
});

  // it('calculate unallocated amount when fee is in edit mode', () => {
  //   const feeLogModel = new PaymentInstructionModel();
  //   feeLogModel.unallocated_amount = 50000;

  //   const feeDetailModel = new FeeDetailModel();
  //   feeDetailModel.amount = 500;
  //   feeDetailModel.remission_amount = 300;
  //   feeDetailModel.refund_amount = 100;
  //   expect(feelogService.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(200);

  //   feeLogModel.unallocated_amount = 30000;
  //   expect(feelogService.getUnallocatedAmount(feeLogModel, feeDetailModel)).toEqual(0);

  // });

  // it ('getFeeLog', () => {
  //   let calledWithParam;
  //   spyOn(http, 'get').and.callFake(param => {
  //     calledWithParam = param;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });

  //   feelogService.getFeeLog('P');
  //   expect(calledWithParam).toBe('/api/payments-instructions?status=P');
  // });

    it ('getFeeLog', () => {
    let calledWithParam;


    feelogService.getFeeLog('P').subscribe(result => {
      expect(result).toBe(true);
    });
    expect(calledWithParam).toBe('/api/payments-instructions?status=P');
  });

  // it('getFeeCodesAndDescriptions', () => {
  //   let calledWithParam;
  //   spyOn(http, 'get').and.callFake(param => {
  //     calledWithParam = param;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });

  //   feelogService.getFeeCodesAndDescriptions('x12', 'family', 'county court');
  //   expect(calledWithParam).toBe('/api/fees/search?query=x12&jurisdiction1=family&jurisdiction2=county court');

  // });

  // it('addFeeToCase', () => {
  //   const calledWithParams = [];
  //   spyOn(http, 'post').and.callFake((param1, param2) => {
  //     calledWithParams[0] = param1;
  //     calledWithParams[1] = param2;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });
  //   const casefeeDetail = new CaseFeeDetailModel();
  //   casefeeDetail.amount = 100;
  //   feelogService.addEditFeeToCase('1', casefeeDetail, 'post');
  //   expect(calledWithParams[0]).toBe('/api/payment-instructions/1/fees');
  //   expect(calledWithParams[1].amount).toBe(100);
  // });

  // it('sendPaymentInstructionAction', () => {
  //   const calledWithParams = [];
  //   spyOn(http, 'put').and.callFake((param1, param2) => {
  //     calledWithParams[0] = param1;
  //     calledWithParams[1] = param2;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });
  //   const pi = new PaymentInstructionModel();
  //   pi.id = 1;
  //   const piAction = new PaymentInstructionActionModel();
  //   piAction.action = 'action';
  //   feelogService.sendPaymentInstructionAction(pi, piAction);
  //   expect(calledWithParams[0]).toBe('/api/payment-instructions/1');
  //   expect(calledWithParams[1]).toBe(piAction);
  // });

  // it('updatePaymentModel', () => {
  //   const calledWithParams = [];
  //   spyOn(http, 'put').and.callFake((param1, param2) => {
  //     calledWithParams[0] = param1;
  //     calledWithParams[1] = param2;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });
  //   const pi = new PaymentInstructionModel();
  //   pi.id = 1;
  //   feelogService.updatePaymentModel(pi);
  //   expect(calledWithParams[0]).toBe('/api/payment-instructions/1');
  //   expect(calledWithParams[1]).toBe(pi);
  // });

  // it('removeFeeFromPaymentInstruction', () => {
  //   let calledWithParam;
  //   spyOn(http, 'delete').and.callFake(param => {
  //     calledWithParam = param;
  //     return {
  //       toPromise: () => {
  //         Promise.resolve(true);
  //       }
  //     };
  //   });
  //   const casefeeDetail = new CaseFeeDetailModel();
  //   casefeeDetail.case_fee_id = 1;
  //   feelogService.removeFeeFromPaymentInstruction(casefeeDetail);
  //   expect(calledWithParam).toBe('/api/fees/1');
  // });

  // it('getFeeJurisdictions', (done: DoneFn) => {
  //   feelogService.getFeeJurisdictions()
  //     .then(response => {
  //       expect(response.success).toBeDefined();
  //       done();
  //     });
  // });

  // it('getFeeJurisdictions with parameters', () => {
  //   let calledWithParam;
  //   spyOn(http, 'get').and.callFake(param => {
  //     calledWithParam = param;
  //     return { toPromise: () => { Promise.resolve(true); }};
  //   });
  //   feelogService.getFeeJurisdictions('jurisdiction1');
  //   expect(calledWithParam).toBe('/api/fees/jurisdictions?jurisdiction=jurisdiction1');
  // });

});
