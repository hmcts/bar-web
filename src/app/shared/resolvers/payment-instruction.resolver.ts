import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, from, forkJoin } from 'rxjs';
import { IResponse } from '../../core/interfaces/response';
import { PaymentslogService } from '../../core/services/paymentslog/paymentslog.service';
import { FeatureService } from '../services/feature/feature.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PaymentInstructionResolver implements Resolve<any> {

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _featureService: FeatureService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IResponse[]> {
    const featureService = this._featureService.findAllFeatures().pipe(map(data => ({ success: true, data })));
    const paymentInstruction = from(this._paymentsLogService.getPaymentById(route.params['id']));
    const unallocatedAmount = from(this._paymentsLogService.getUnallocatedAmount(route.params['id']));
    return forkJoin(paymentInstruction, unallocatedAmount, featureService);
  }

}
