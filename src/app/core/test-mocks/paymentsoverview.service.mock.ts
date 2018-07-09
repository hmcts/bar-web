import {Observable} from 'rxjs/Observable';
import { IResponse } from '../interfaces';

const stats = `
{
  "content":{
     "0":[
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"cards",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=cards"
              }
           }
        },
        {
           "count":2,
           "total_amount":110000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"cash",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=cash"
              }
           }
        },
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"cheques",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=cheques"
              },
              "stat-group-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=cheques,postal-orders"
              }
           }
        },
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"postal-orders",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=postal-orders"
              },
              "stat-group-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=cheques,postal-orders"
              }
           }
        }
     ]
  },
  "_links":{
     "self":{
        "href":"http://localhost:8080/users/365751/payment-instructions/stats?status=PA"
     }
  }
}
`;
export class PaymentsOverviewServiceMock {

  getPaymentsOverview (userRole: string, status: string): Observable<IResponse> {
    const data = [];
    const success = true;

    return new Observable(observer => {
      observer.next({ data, success });
      observer.complete();
    });
  }

  getPaymentStatsByUserAndStatus(userId, status): Observable<IResponse> {
    const data = JSON.parse(stats);
    const success = true;

    return new Observable(observer => {
      observer.next({data, success});
      observer.complete();
    });
  }
}
