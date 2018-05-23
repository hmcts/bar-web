import {Observable} from 'rxjs/Observable';
import { IResponse } from '../interfaces';
export class PaymentsOverviewServiceMock {

  getPaymentsOverview (userRole: string, status: string): Observable<IResponse> {
    const data = [];
    const success = true;

    return new Observable(observer => {
      observer.next({ data, success });
      observer.complete();
    });
  }
}
