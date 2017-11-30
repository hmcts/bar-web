import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class FeelogService {

  private feelogResponse: any = false;

  constructor(private http: HttpClient) { }

    getFeeLog() {
      this.feelogResponse = [{
        'amount': 200,
        'currency': 'GBP',
        'daily_sequence_id': 111,
        'id': 111,
        'payer_name': 'Payer 1',
        'payment_type': 'Cheque',
        'payment_date': '01-December-2017',
        'site_id': '2',
        'status': 'draft'
      }, {
        'amount': 38393.87,
        'currency': 'GBP',
        'daily_sequence_id': 222,
        'id': 222,
        'payer_name': 'Payer 2',
        'payment_type': 'Cheque',
        'payment_date': '01-December-2017',
        'site_id': '2',
        'status': 'draft'
      }, {
        'amount': 456.87,
        'currency': 'GBP',
        'daily_sequence_id': 333,
        'id': 333,
        'payer_name': 'Payer 3',
        'payment_type': 'Cheque',
        'payment_date': '01-December-2017',
        'site_id': '4',
        'status': 'draft'
      }
    ];
    return this.feelogResponse;
      /*
      return this.http
        .get(`${environment.apiUrl}/feeLog`)
        .toPromise();
        */
    }

}
