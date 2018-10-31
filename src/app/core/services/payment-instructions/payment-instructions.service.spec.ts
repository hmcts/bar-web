import { PaymentInstructionsService } from './payment-instructions.service';
import { HttpClient } from '@angular/common/http';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { createPaymentInstruction,
  createPostalOrderPaymentType,
  createCardPaymentType,
  createAllPayPaymentType,
  paymentInstructionData } from '../../../test-utils/test-utils';
import { CheckAndSubmit } from '../../models/check-and-submit';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { Meta } from '@angular/platform-browser';
import { PaymentTypeEnum } from '../../models/payment.type.enum';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { of } from 'rxjs';

describe('PaymentInstructionsService', () => {
  let paymentInstructionsService: PaymentInstructionsService;
  let http: BarHttpClient;
  let paymentStateService;
  const paymentTypeEnum = new PaymentTypeEnum();

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentStateService = new PaymentstateServiceMock();
    paymentInstructionsService = new PaymentInstructionsService(http, paymentStateService);
  });

  it('getPaymentInstructions', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentInstructionsService.getPaymentInstructions([PaymentStatus.PENDING]);
    expect(calledWithParams).toEqual('/api/payment-instructions?status=P');
  });

  it('savePaymentInstruction', async() => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1, param2) => {
      calledWithParams[0] = param1;
      calledWithParams[1] = param2;
      return of({});
    });
    const piToSave = createPaymentInstruction();
    paymentInstructionsService.savePaymentInstruction(piToSave)
      .subscribe(() => {
        expect(calledWithParams[0]).toEqual('/api/payment/cheques');
        expect(calledWithParams[1]).toEqual(piToSave);
      });
  });

  it('transformIntoCheckAndSubmitModels', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    expect(checkAndSubmitModel.length).toBe(2);
    expect(checkAndSubmitModel[0].caseReference).toBe('ccc111');
    expect(checkAndSubmitModel[1].caseReference).toBe('ccc111');
    expect(checkAndSubmitModel[0].fee).toBe(480.00);
    expect(checkAndSubmitModel[1].fee).toBe(215.00);
  });

  it('transformIntoPaymentInstructionModel when check', async() => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);

    const paymentInstruction = await paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('650');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe(paymentTypeEnum.CHEQUE);
  });

  it('transformIntoPaymentInstructionModel when postal order', async() => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createPostalOrderPaymentType();
    checkAndSubmitModel[0].postalOrderNumber = '12345';

    const paymentInstruction = await paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('650');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe(paymentTypeEnum.POSTAL_ORDER);
    expect(paymentInstruction.postal_order_number).toBe('12345');
  });

  it('transformIntoPaymentInstructionModel when card', async() => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createCardPaymentType();
    checkAndSubmitModel[0].authorizationCode = '12345';

    const paymentInstruction = await paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('650');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe(paymentTypeEnum.CARD);
    expect(paymentInstruction.authorization_code).toBe('12345');
  });

  it('transformIntoPaymentInstructionModel when allpay', async() => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createAllPayPaymentType();
    checkAndSubmitModel[0].allPayTransactionId = '12345';

    const paymentInstruction = await paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('650');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe(paymentTypeEnum.ALLPAY);
    expect(paymentInstruction.all_pay_transaction_id).toBe('12345');
  });

  it('transformJsonIntoPaymentInstructionModels', () => {
    const pis: Array<PaymentInstructionModel> =
      paymentInstructionsService.transformJsonIntoPaymentInstructionModels([paymentInstructionData]);
    expect(pis.length).toBe(1);
    expect(pis[0].amount).toBe(650);
    expect(pis[0].payer_name).toBe('Jane Doe');
  });
});
