import { IResponse } from '../interfaces';
import { of, Observable } from 'rxjs';
import { paymentInstructionActionData } from '../../test-utils/test-utils';

export class PaymentActionServiceMock {
    getPaymentActions(): Observable<IResponse> {
        return of({ success: true, data: [paymentInstructionActionData] });
    }
}
