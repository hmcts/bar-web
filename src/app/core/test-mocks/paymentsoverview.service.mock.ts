// tslint:disable:no-trailing-whitespace
// tslint:disable:max-line-length

import { Observable } from 'rxjs';
import { IResponse } from '../interfaces';
import { PaymentTypeEnum } from '../models/payment.type.enum';
import {of} from 'rxjs/internal/observable/of';

const paymentTypeEnum = new PaymentTypeEnum();

export const stats = `
{
  "content":{
     "0":[
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"CARD",
           "action":"Process",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.CARD}"
              }
           }
        },
        {
           "count":2,
           "total_amount":110000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"CASH",
           "action":"Process",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.CASH}"
              }
           }
        },
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"CHEQUE",
           "action":"Process",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.CHEQUE}"
              },
              "stat-group-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.CHEQUE},${paymentTypeEnum.POSTAL_ORDER}"
              }
           }
        },
        {
           "count":1,
           "total_amount":55000,
           "user_id":"365751",
           "status":"PA",
           "payment_type":"POSTAL_ORDER",
           "action":"Process",
           "bgc":null,
           "_links":{
              "stat-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.POSTAL_ORDER}"
              },
              "stat-group-details":{
                 "href":"http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=${paymentTypeEnum.CHEQUE},${paymentTypeEnum.POSTAL_ORDER}"
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

  getRecordedData(status: string): Observable<IResponse> {
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

  getPaymentInstructionCount(status: string): Observable<IResponse> {
    return of({success: true, data: 0});
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
