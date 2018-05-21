import { TestBed, inject } from '@angular/core/testing';

import { PaymentInstructionsService } from './payment-instructions.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { createPaymentInstruction,
  createPostalOrderPaymentType,
  createCardPaymentType,
  createAllPayPaymentType,
  paymentInstructionData } from '../../../test-utils/test-utils';
import { CheckAndSubmit } from '../../models/check-and-submit';
import { PaymentTypeModel } from '../../models/paymenttype.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';

describe('PaymentInstructionsService', () => {
  let paymentInstructionsService: PaymentInstructionsService;
  let http: HttpClient;

  beforeEach(() => {
    http = instance(mock(HttpClient));
    paymentInstructionsService = new PaymentInstructionsService(http);
  });

  it('getPaymentInstructions', () => {
    let calledWithParams: any;
    spyOn(http, 'get').and.callFake(params => {
      calledWithParams = params;
    });
    paymentInstructionsService.getPaymentInstructions([PaymentStatus.PENDING]);
    expect(calledWithParams).toEqual('http://localhost:3000/api/payment-instructions?status=P');
  });

  it('savePaymentInstruction', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1, param2) => {
      calledWithParams[0] = param1;
      calledWithParams[1] = param2;
    });
    const piToSave = createPaymentInstruction();
    paymentInstructionsService.savePaymentInstruction(piToSave);

    expect(calledWithParams[0]).toEqual('http://localhost:3000/api/payment/cheques');
    expect(calledWithParams[1]).toEqual(piToSave);
  });

  it('transformIntoCheckAndSubmitModels', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    expect(checkAndSubmitModel.length).toBe(2);
    expect(checkAndSubmitModel[0].caseReference).toBe('ccc111');
    expect(checkAndSubmitModel[1].caseReference).toBe('ccc111');
    expect(checkAndSubmitModel[0].fee).toBe('£480.00');
    expect(checkAndSubmitModel[1].fee).toBe('£215.00');
  });

  it('transformIntoPaymentInstructionModel when check', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);

    const paymentInstruction = paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('£650.00');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe('cheques');
  });

  it('transformIntoPaymentInstructionModel when postal order', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createPostalOrderPaymentType();
    checkAndSubmitModel[0].postalOrderNumber = '12345';

    const paymentInstruction = paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('£650.00');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe('postal-orders');
    expect(paymentInstruction.postal_order_number).toBe('12345');
  });

  it('transformIntoPaymentInstructionModel when card', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createCardPaymentType();
    checkAndSubmitModel[0].authorizationCode = '12345';

    const paymentInstruction = paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('£650.00');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe('cards');
    expect(paymentInstruction.authorization_code).toBe('12345');
  });

  it('transformIntoPaymentInstructionModel when allpay', () => {
    const piToTransfer = [createPaymentInstruction()];
    const checkAndSubmitModel: Array<CheckAndSubmit> = paymentInstructionsService.transformIntoCheckAndSubmitModels(piToTransfer);
    checkAndSubmitModel[0].paymentType = createAllPayPaymentType();
    checkAndSubmitModel[0].allPayTransactionId = '12345';

    const paymentInstruction = paymentInstructionsService.transformIntoPaymentInstructionModel(checkAndSubmitModel[0]);
    expect(paymentInstruction.amount.toString()).toBe('£650.00');
    expect(paymentInstruction.payer_name).toBe('Jane Doe');
    expect(paymentInstruction.payment_type.id).toBe('allpay');
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
