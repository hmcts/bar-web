import { of } from 'rxjs/observable/of';
import { paymentInstructionActionData } from '../../test-utils/test-utils';
import { Observable } from 'rxjs/Observable';
import { IResponse } from '../interfaces';

export class PaymentActionServiceMock {
    getPaymentActions(): Observable<IResponse> {
        return of({ success: true, data: [paymentInstructionActionData] });
    }
}
