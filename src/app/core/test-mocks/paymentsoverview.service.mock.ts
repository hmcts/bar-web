import { Observable } from 'rxjs/Observable';
import { IResponse } from '../interfaces';
import { of } from '../../../../node_modules/rxjs/observable/of';

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

  getPaymentsOverview(status: string): Observable<IResponse> {
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
      observer.next({ data, success });
      observer.complete();
    });
  }



  getRejectedPaymentsOverview(oldStatus: string, newStatus: string): Observable<IResponse> {
    return of({
      data: {
        '365751': [
          {
            'bar_user_id': '365751',
            'bar_user_full_name': 'Karen Taylor',
            'count_of_payment_instruction_in_specified_status': 1,
            'list_of_payment_instructions': [1, 2, 3]
          }
        ],
        '365752': [
          {
            'bar_user_id': '365752',
            'bar_user_full_name': 'James Black',
            'count_of_payment_instruction_in_specified_status': 2,
            'list_of_payment_instructions': [1, 2, 3]
          }
        ],
        '365756': [
          {
            'bar_user_id': '365756',
            'bar_user_full_name': 'James2 Black2',
            'count_of_payment_instruction_in_specified_status': 1,
            'list_of_payment_instructions': [1, 2, 3]
          }
        ]
      },
      success: true
    });
  }
}
