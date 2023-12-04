import { TestBed, inject } from '@angular/core/testing';

import { PaymentslogService } from './paymentslog.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { UserModel } from '../../models/user.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { Observable, of } from 'rxjs';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Meta } from '@angular/platform-browser';
import { PaymentAction } from '../../models/paymentaction.model';

describe('PaymentslogService', () => {
  const USER_OBJECT: UserModel = new UserModel({
    id: 365750,
    courtId: 'BR04',
    email: 'delivery.manager@hmcts.net',
    forename: 'Dee',
    surname: 'Aliu',
    password: 'password',
    roles: ['bar-delivery-manager', 'bar-fee-clerk']
  });

  let calledWithParam;
  let paymentslogService: PaymentslogService;
  const httpClient = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
  beforeEach(() => {
    paymentslogService =  new PaymentslogService(httpClient);
  });

  it('getPaymentsLog with status', () => {
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getPaymentsLog(USER_OBJECT);
    expect(calledWithParam).toBe('/api/users/365750/payment-instructions?');
  });

  it('getPaymentsLogByUser', () => {
    const searchModel = new SearchModel();
    searchModel.id = '365750';
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return new Observable(observer => {
        observer.next(true),
        observer.complete();
      });
    });
    paymentslogService.getPaymentsLogByUser(searchModel);
    expect(calledWithParam).toBe('/api/users/365750/payment-instructions?status=D');
  });

  it('getAllPaymentInstructions', () => {
    const searchModel = new SearchModel();
    searchModel.id = '365750';
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return new Observable(observer => {
        observer.next(true),
        observer.complete();
      });
    });
    paymentslogService.getAllPaymentInstructions();
    expect(calledWithParam).toBe('/api/payment-instructions');
  });

  it('getPaymentById', () => {
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getPaymentById(3);
    expect(calledWithParam).toBe('/api/payment-instructions/3');
  });

  it('getUnallocatedAmount', () => {
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getUnallocatedAmount(3);
    expect(calledWithParam).toBe('/api/payment-instructions/3/unallocated');
  });

  it('sendPendingPayments', () => {
    //@ts-ignore
    spyOn(httpClient, 'post').and.callFake((param1, param2) => {
      calledWithParam = [];
      calledWithParam[0] = param1;
      calledWithParam[1] = param2;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.sendPendingPayments({value: 'this is a value'});
    expect(calledWithParam[0]).toBe('/api/payment-instructions');
    expect(calledWithParam[1]).toEqual({value: 'this is a value'});
  });

  it('deletePaymentLogById', () => {
    //@ts-ignore
    spyOn(httpClient, 'delete').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.deletePaymentLogById(3);
    expect(calledWithParam).toBe('/api/payment-instructions/3');
  });

  it('searchPayments', () => {
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.searchPayments('this_is_a_search_quesry');
    expect(calledWithParam).toBe('/api/payment-instructions/search?q=this_is_a_search_quesry');
  });

  it('searchPaymentsByDate', () => {
    const searchModel = new SearchModel();
    searchModel.caseReference = '123abc';
    searchModel.status = PaymentStatus.PENDING;
    searchModel.action = '';
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.searchPaymentsByDate(searchModel);
    expect(calledWithParam).toBe('/api/payment-instructions/search?status=P&caseReference=123abc');
  });

  it('searchPaymentsByDate when status is TTB so C is automatically added', () => {
    const searchModel = new SearchModel();
    searchModel.caseReference = '123abc';
    searchModel.status = PaymentStatus.TRANSFERREDTOBAR;
    searchModel.action = '';
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.searchPaymentsByDate(searchModel);
    expect(calledWithParam).toBe('/api/payment-instructions/search?status=TTB,C&caseReference=123abc');
  });

  it('getPaymentsLogCsvReport', () => {
    //@ts-ignore
    spyOn(httpClient, 'get').and.callFake((param1, param2) => {
      calledWithParam = [];
      calledWithParam[0] = param1;
      calledWithParam[1] = param2;
      return { toPromise: () => Promise.resolve(true) };
    });
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'text/csv');

    paymentslogService.getPaymentsLogCsvReport();
    expect(calledWithParam[0]).toBe('/api/payment-instructions?format=csv');
    expect(calledWithParam[1]).toEqual({ headers: httpHeaders });
  });

  it('should send the necessary parameters', () => {
    const searchModel = new SearchModel;
    searchModel.id = '123';
    searchModel.action = PaymentAction.WITHDRAW;
    searchModel.status = PaymentStatus.getPayment('Validated').code;
    spyOn(httpClient, 'get').and.callFake(url => {
      calledWithParam = url;
      return of({ body: [] });
    });
    paymentslogService.getPaymentsLogByUser(searchModel);
    expect(calledWithParam).toBe(`/api/users/${searchModel.id}/payment-instructions?status=V&action=Withdraw`);
  });
});
