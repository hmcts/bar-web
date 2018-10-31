import { PaymentActionService } from './paymentaction.service';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { mock, instance } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('PaymentActionService', () => {
  let http, paymentActionService;

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentActionService = new PaymentActionService(http);
  });

  it('should load service', () => {
    expect(paymentActionService).toBeTruthy();
  });

  it('should send the right response', () => {
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return of({ data: [], success: true });
    });

    paymentActionService.getPaymentActions();
    expect(calledWithParam).toEqual('/api/payment-action');
  });
});
