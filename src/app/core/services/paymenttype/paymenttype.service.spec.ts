import { TestBed, inject } from '@angular/core/testing';

import { PaymenttypeService } from './paymenttype.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IPaymentType, IPaymentsLog } from '../../interfaces/payments-log';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';

describe('PaymenttypeService', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule ],
      providers: [PaymenttypeService]
    });

    http = instance(mock(HttpClient));
  });

  it('should be created', inject([PaymenttypeService], (service: PaymenttypeService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a promise (blank array?)', inject([PaymenttypeService], async(service: PaymenttypeService) => {
    const paymentTypes = await service.getPaymentTypes();
    expect(paymentTypes).toEqual([]);
  }));

  it('should set payment type list', inject([PaymenttypeService], (service: PaymenttypeService) => {
    const paymentTypes: IPaymentType[] = [];
    const paymentTypeSource$ = service.paymentTypesSource$;
    service.setPaymentTypeList(paymentTypes);
    expect(service.paymentTypesSource$.getValue()).toEqual(paymentTypes);
  }));

  it('should save paymentmodel', inject([PaymenttypeService], async(service: PaymenttypeService) => {
    const paymentInstruction: PaymentInstructionModel = createPaymentInstruction();
    const makeRequest = await service.savePaymentModel(paymentInstruction);
    let parameters;
    spyOn(http, 'post').and.callFake(param => {
      parameters = param;
      return {
        toPromise: () => {
          return Promise.resolve({ success: true, data: null });
        }
      };
    });
    service.savePaymentModel(paymentInstruction);
    expect(parameters).toBe('http://localhost:3000/api/cash');
  }));
});
