import { TestBed, inject } from '@angular/core/testing';

import { PaymentsOverviewService } from './paymentsoverview.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule, BaseRequestOptions} from '@angular/http';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { PaymentStatus } from '../../models/paymentstatus.model';

describe('PaymentsOverviewService', () => {

  let paymentsOverviewService: PaymentsOverviewService;
  let http: BarHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpModule],
      providers: [PaymentsOverviewService, BarHttpClient]
    });
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentsOverviewService = new PaymentsOverviewService(http);
  });

  it('should be created', inject([PaymentsOverviewService], (service: PaymentsOverviewService) => {
    expect(service).toBeTruthy();
  }));

  it('getPaymentsOverview', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentsOverviewService.getPaymentsOverview(PaymentStatus.PENDING);
    expect(calledWithParams).toEqual('/api/users/pi-stats?status=P');
  });

  it('getRejectedPaymentsOverview', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentsOverviewService.getRejectedPaymentsOverview(PaymentStatus.APPROVED, PaymentStatus.PENDING);
    expect(calledWithParams).toEqual('/api/users/pi-stats?status=A&oldStatus=P');
  });

  it('getPaymentStatsByUserAndStatus', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentsOverviewService.getPaymentStatsByUserAndStatus('1234', PaymentStatus.PENDING);
    expect(calledWithParams).toEqual('/api/users/1234/payment-instructions/stats?status=P');
  });

  it('getPaymentInstructionCount', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentsOverviewService.getPaymentInstructionCount(PaymentStatus.PENDING);
    expect(calledWithParams).toContain('/api/payment-instructions/count?status=P');
  });

  it('getRecordedData', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentsOverviewService.getRecordedData(PaymentStatus.DRAFT);
    expect(calledWithParams).toEqual('/api/users/pi-stats/count?status=D');
  });

});
