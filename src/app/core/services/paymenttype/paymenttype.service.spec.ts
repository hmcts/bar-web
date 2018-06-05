import { TestBed, inject } from '@angular/core/testing';

import { PaymenttypeService } from './paymenttype.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IPaymentType, IPaymentsLog } from '../../interfaces/payments-log';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';

describe('PaymenttypeService', () => {
  let paymentTypeService: PaymenttypeService;
  let http: HttpClient;

  beforeEach(() => {
    http = instance(mock(HttpClient));
    paymentTypeService = new PaymenttypeService(http);
  });

  it('should return a promise (blank array?)', async() => {
    const paymentTypes = await paymentTypeService.getPaymentTypes();
    expect(paymentTypes).toEqual([]);
  });

  it('should set payment type list', (async() => {
    const paymentTypes: IPaymentType[] = [];
    paymentTypeService.setPaymentTypeList(paymentTypes);
    expect(paymentTypeService.paymentTypesSource$.getValue()).toEqual(paymentTypes);
  }));

  it('savePaymentModel', () => {
    let parameters;
    spyOn(http, 'post').and.callFake(param => {
      parameters = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const paymentInstruction: PaymentInstructionModel = createPaymentInstruction();
    paymentTypeService.savePaymentModel(paymentInstruction);
    expect(parameters).toBe('http://localhost:3000/api/payment/cheques');
  });
});
