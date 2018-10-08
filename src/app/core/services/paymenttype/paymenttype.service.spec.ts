
import { PaymenttypeService } from './paymenttype.service';
import { HttpClient } from '@angular/common/http';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Meta } from '@angular/platform-browser';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { IPaymentstateService } from '../../../shared/services/state/paymentstate.service.interface';
import { of } from 'rxjs';

describe('PaymenttypeService', () => {
  let paymentTypeService: PaymenttypeService;
  let http: BarHttpClient;
  let paymentStateService: IPaymentstateService;

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentStateService = new PaymentstateServiceMock();
    paymentTypeService = new PaymenttypeService(http, paymentStateService);
  });

  it('should return a subject with payment types', async() => {
    const paymentTypes = await paymentTypeService.getPaymentTypes();
    paymentTypes.subscribe(pTypes => {
      expect(pTypes.length).toEqual(5);
    });
  });

  it('savePaymentModel', async() => {
    let parameters;
    spyOn(http, 'post').and.callFake(param => {
      parameters = param;
      return of({});
    });
    const paymentInstruction: PaymentInstructionModel = createPaymentInstruction();
    paymentTypeService.savePaymentModel(paymentInstruction)
      .subscribe(() => {
        expect(parameters).toBe('/api/payment/cheques');
      });
  });
});
