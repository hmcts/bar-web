import { TestBed, inject } from '@angular/core/testing';

import { PaymentslogService } from './paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { UserModel } from '../../models/user.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { Observable } from 'rxjs/Observable';

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
  const httpClient = instance(mock(HttpClient));
  beforeEach(() => {
    paymentslogService =  new PaymentslogService(httpClient);
  });

  it('getPaymentsLog', () => {
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getPaymentsLog(USER_OBJECT);
    expect(calledWithParam).toBe('http://localhost:3000/api/users/365750/payment-instructions');
  });

  it('getPaymentsLog with status', () => {
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getPaymentsLog(USER_OBJECT, PaymentStatus.PENDING);
    expect(calledWithParam).toBe('http://localhost:3000/api/users/365750/payment-instructions?status=P');
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
    expect(calledWithParam).toBe('http://localhost:3000/api/users/365750/payment-instructions?status=D');
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
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions');
  });

  it('getPaymentById', () => {
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getPaymentById(3);
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions/3');
  });

  it('getUnallocatedAmount', () => {
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.getUnallocatedAmount(3);
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions/3/unallocated');
  });

  it('sendPendingPayments', () => {
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
    expect(calledWithParam[0]).toBe('http://localhost:3000/api/payment-instructions');
    expect(calledWithParam[1]).toEqual({value: 'this is a value'});
  });

  it('deletePaymentLogById', () => {
    spyOn(httpClient, 'delete').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.deletePaymentLogById(3);
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions/3');
  });

  it('searchPayments', () => {
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.searchPayments('this_is_a_search_quesry');
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions/search?q=this_is_a_search_quesry');
  });

  it('searchPaymentsByDate', () => {
    const searchModel = new SearchModel();
    searchModel.caseReference = '123abc';
    searchModel.status = PaymentStatus.PENDING;
    searchModel.action = '';
    spyOn(httpClient, 'get').and.callFake(param => {
      calledWithParam = param;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    paymentslogService.searchPaymentsByDate(searchModel);
    expect(calledWithParam).toBe('http://localhost:3000/api/payment-instructions/search?status=P&caseReference=123abc');
  });

  it('getPaymentsLogCsvReport', () => {
    spyOn(httpClient, 'get').and.callFake((param1, param2) => {
      calledWithParam = [];
      calledWithParam[0] = param1;
      calledWithParam[1] = param2;
      return {
        toPromise: () => {
          Promise.resolve(true);
        }
      };
    });
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'text/csv');

    paymentslogService.getPaymentsLogCsvReport();
    expect(calledWithParam[0]).toBe('http://localhost:3000/api/payment-instructions?format=csv');
    expect(calledWithParam[1]).toEqual({ headers: httpHeaders });
  });
});
