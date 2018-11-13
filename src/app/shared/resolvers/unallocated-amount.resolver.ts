import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PaymentslogService } from '../../core/services/paymentslog/paymentslog.service';
import { Observable, from } from 'rxjs';
import { IResponse } from '../../core/interfaces/response';

@Injectable()
export class UnallocatedAmountResolver implements Resolve<any> {

  constructor(private _paymentsLogService: PaymentslogService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IResponse> {
    return from(this._paymentsLogService.getUnallocatedAmount(route.params['id']));
  }

}
