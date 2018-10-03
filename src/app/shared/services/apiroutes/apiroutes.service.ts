import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiroutesService {

  static routes = {

    paymentInstructions: `/api/payment-instructions`,
    userPaymentInstructions: `/api/users/:id/payment-instructions`

  };

}
