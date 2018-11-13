import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { IResponse } from '../../core/interfaces/response';
import { PaymentslogService } from '../../core/services/paymentslog/paymentslog.service';

@Injectable()
export class PaymentInstructionResolver implements Resolve<any> {

  constructor(private _paymentsLogService: PaymentslogService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IResponse> {
    return from(this._paymentsLogService.getPaymentById(route.params['id']));
  }

}
