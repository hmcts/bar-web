import {PaymentInstructionModel} from '../core/models/paymentinstruction.model';
import {CheckAndSubmit} from '../core/models/check-and-submit';
import {feelogMainCompHtml} from './feelog-main-content';
import {feelogDetailCompHtml} from './feelog-edit-content';
import {PaymentTypeModel} from '../core/models/paymenttype.model';
import {PaymentTypeEnum} from '../core/models/payment.type.enum';
import {UserModel} from '../core/models/user.model';

const paymentTypeEnum = new PaymentTypeEnum();

export const paymentInstructionData = JSON.parse('{\"payer_name\":\"Jane Doe\",\"amount\":650,\"currency\":\"GBP\",' +
'\"status\":\"P\",\"cheque_number\":\"123456\",\"id\":3,\"paymentId\":3,\"payment_date\":\"2018-05-09T08:46:26.163\",' +
'\"site_id\":\"BR01\",\"daily_sequence_id\":2,\"payment_type\":{\"id\":\"' + paymentTypeEnum.CHEQUE + '\",\"name\":\"Cheque\"},' +
'\"case_fee_details\":[{\"payment_instruction_id\":3,\"fee_code\":\"X0033\",\"amount\":480,' +
'\"fee_description\":\"Recovery of Land - High Court\",\"fee_version\":\"3\",\"case_reference\":\"ccc111\",' +
'\"remission_amount\":30,\"remission_benefiter\":\"someone\",\"remission_authorisation\":\"auth123\",' +
'\"refund_amount\":null,\"case_fee_id\":7},{\"payment_instruction_id\":3,\"fee_code\":\"X0179\",\"amount\":215,' +
'\"fee_description\":\"Special guardianship orders (section 14A(3) or (6)(a), 14C(3) or 14D(1))\",' +
'\"fee_version\":\"3\",\"case_reference\":\"ccc111\",\"remission_amount\":15,\"remission_benefiter\":\"someone\",' +
'\"remission_authorisation\":\"auth2\",\"refund_amount\":null,\"case_fee_id\":8}],\"payhub_references":[]}');

export const paymentInstructionDataRaw = JSON.parse('{\"expectedRoles\":[\"bar-fee-clerk\",\"bar-senior-clerk\",' +
'\"bar-delivery-manager\"],\"paymentInstructionData\":[{\"data\":{\"payer_name\":\"Jane Doe\",\"amount\":650,\"currency\":\"GBP\",' +
'\"status\":\"P\",\"cheque_number\":\"123456\",\"id\":3,\"payment_date\":\"2018-05-09T08:46:26.163\",' +
'\"site_id\":\"BR01\",\"daily_sequence_id\":2,\"payment_type\":{\"id\":\"' + paymentTypeEnum.CHEQUE + '\",\"name\":\"Cheque\"},' +
'\"case_fee_details\":[{\"payment_instruction_id\":3,\"fee_code\":\"X0033\",\"amount\":480,' +
'\"fee_description\":\"Recovery of Land - High Court\",\"fee_version\":\"3\",\"case_reference\":\"ccc111\",' +
'\"remission_amount\":30,\"remission_benefiter\":\"someone\",\"remission_authorisation\":\"auth123\",' +
'\"refund_amount\":null,\"case_fee_id\":7},{\"payment_instruction_id\":3,\"fee_code\":\"X0179\",\"amount\":215,' +
'\"fee_description\":\"Special guardianship orders (section 14A(3) or (6)(a), 14C(3) or 14D(1))\",' +
'\"fee_version\":\"3\",\"case_reference\":\"ccc111\",\"remission_amount\":15,\"remission_benefiter\":\"someone\",' +
'\"remission_authorisation\":\"auth2\",\"refund_amount\":null,\"case_fee_id\":8}]},\"success\":true}' +
',{\"success\":true,\"data\":0},{\"success\":true,\"data\":[{\"uid\":\"payment-actions' +
'-refund\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":null,' +
'\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"payment-' +
'actions-process\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":' +
'null,\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"payment-' +
'actions-suspense\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":' +
'null,\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"send-to-' +
'payhub\",\"enable\":true,\"description\":\"Send payment instructions to PayHub\",\"group\":null,' +
'\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"payment-actions' +
'-return\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":null,' +
'\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"payment-actions' +
'-withdraw\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":null,' +
'\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"payment-actions-' +
'suspence-deficiency\",\"enable\":true,\"description\":\"Available actions for payment\",\"group\":' +
'null,\"permissions\":[],\"flippingStrategy\":null,\"customProperties\":{}},{\"uid\":\"make-editpage-' +
'readonly\",\"enable\":true,\"description\":\"Make page read only\",\"group\":null,\"permissions\":[],' +
'\"flippingStrategy\":null,\"customProperties\":{}}]}]}');

export function getPaymentInstructionDataRaw() {
  return paymentInstructionDataRaw;
}

export const paymentInstructionActionData = { action: 'Process' };

export function createPaymentInstruction() {
  const feeLogModel = new PaymentInstructionModel();
  feeLogModel.assign(paymentInstructionData);
  return feeLogModel;
}

export function getPaymentInstructions() {
  // loop of data
  const models: PaymentInstructionModel[] = [];
  let i;
  for (i = 0; i < 10; i++) {
    const model = new PaymentInstructionModel();
    model.assign(paymentInstructionData);
    models.push(model);
  }

  return models;
}

export function createMockUser(userType: string) {
  class MockUser {
    user: UserModel = new UserModel({
      uid: 365750,
      courtId: 'BR01',
      sub: 'email@hmcts.net',
      given_name: 'Users',
      family_name: 'Fullname',
      password: 'password',
      roles: [userType]
    });

    getUser(): UserModel {
      return this.user;
    }

    authenticate(user: UserModel) {
      return true;
    }
  }
  return new MockUser().getUser();
}

export function getPaymentInstructionById(id: number) {
  const paymentInstructionModel = new PaymentInstructionModel();
  paymentInstructionModel.assign(paymentInstructionData);
  paymentInstructionModel.id = id;
  return paymentInstructionModel;
}

export function transformIntoCheckAndSubmitModel(
  paymentInstructions: PaymentInstructionModel[]
): CheckAndSubmit[] {
  const json = [
    {
      checked: false,
      formatter: { _locale: 'GBP' },
      paymentId: 95,
      date: '2018-04-20T13:56:12.460',
      name: 'Uriah James',
      paymentType: { id: 'cash', name: 'Cash' },
      paymentAmount: '£200.00',
      status: 'Validated',
      action: 'Process',
      dailySequenceId: 1,
      caseReference: '55',
      fee: '£100.00',
      remission: '-',
      refund: null
    },
    {
      checked: false,
      formatter: { _locale: 'GBP' },
      paymentId: null,
      date: null,
      name: null,
      paymentType: null,
      paymentAmount: null,
      status: '',
      action: '',
      dailySequenceId: null,
      caseReference: '55',
      fee: '£100.00',
      remission: '-',
      refund: null
    }
  ];

  const models: CheckAndSubmit[] = [];
  let i;

  for (i = 0; i < json.length; i++) {
    const paymentInstruction = new PaymentInstructionModel();
    paymentInstruction.assign(json[i]);

    const model = new CheckAndSubmit();
    model.convertTo(paymentInstruction);

    models.push(model);
  }

  return models;
}

export function getFeelogMainHtml() {
  return convertTxtToOneLine(feelogMainCompHtml);
}

export function getFeeLogDetailHtml() {
  return convertTxtToOneLine(feelogDetailCompHtml);
}

export function convertTxtToOneLine(text: string) {
  return text.split('\n')
    .map(line => line.trim().replace(/ngcontent-c\d*/g, ''))
    .join('').replace(/\s/g, '');
}

export function createAllPayPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = paymentTypeEnum.ALLPAY;
  payment_type.name = 'All Pay';
  return payment_type;
}

export function createPostalOrderPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = paymentTypeEnum.POSTAL_ORDER;
  payment_type.name = 'Postal Order';
  return payment_type;
}

export function createCardPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = paymentTypeEnum.CARD;
  payment_type.name = 'Card';
  return payment_type;
}

export function createChequePaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = paymentTypeEnum.CHEQUE;
  payment_type.name = 'Cheque';
  return payment_type;
}

export function createCashPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = paymentTypeEnum.CASH;
  payment_type.name = 'Cash';
  return payment_type;
}

export function getPaymentInstructionList(): PaymentInstructionModel[] {
  const paymentInstructions: PaymentInstructionModel[] = [];
  const paymentInstruction = createPaymentInstruction();
  for (let i = 0; i < 5; i++) {
    paymentInstruction.id = i;
    paymentInstructions.push(paymentInstruction);
  }

  return paymentInstructions;
}

/**
 * Responsible for generating a certain number of models in an array
 * @param number number of instances of the model to return
 * @param currentModels current list of models
 * @param sampleData sample data to "mock"
 */
export function modelGenerator(
  number: number,
  currentModels: any[],
  sampleData: any = {}
): any[] {
  let models = currentModels.length > 0 ? currentModels : [];
  models = [...models, sampleData];
  return number > 1 ? modelGenerator(number - 1, models, sampleData) : models;
}
