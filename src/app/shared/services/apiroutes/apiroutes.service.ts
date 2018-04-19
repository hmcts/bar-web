import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiroutesService {

  static routes = {

    paymentInstructions: `${environment.apiUrl}/payment-instructions`,
    userPaymentInstructions: `${environment.apiUrl}/users/:id/payment-instructions`

  };

}
