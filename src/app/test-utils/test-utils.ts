import {PaymentInstructionModel} from '../core/models/paymentinstruction.model';
import {CheckAndSubmit} from '../core/models/check-and-submit';
import { feelogMainCompHtml } from './feelog-main-content';
import { feelogDetailCompHtml } from './feelog-edit-content';
import { PaymentTypeModel } from '../core/models/paymenttype.model';

export const paymentInstructionData = JSON.parse('{\"payer_name\":\"Jane Doe\",\"amount\":650,\"currency\":\"GBP\",' +
'\"status\":\"P\",\"cheque_number\":\"123456\",\"id\":3,\"payment_date\":\"2018-05-09T08:46:26.163\",' +
'\"site_id\":\"BR01\",\"daily_sequence_id\":2,\"payment_type\":{\"id\":\"cheques\",\"name\":\"Cheque\"},' +
'\"case_fee_details\":[{\"payment_instruction_id\":3,\"fee_code\":\"X0033\",\"amount\":480,' +
'\"fee_description\":\"Recovery of Land - High Court\",\"fee_version\":\"3\",\"case_reference\":\"ccc111\",' +
'\"remission_amount\":30,\"remission_benefiter\":\"someone\",\"remission_authorisation\":\"auth123\",' +
'\"refund_amount\":null,\"case_fee_id\":7},{\"payment_instruction_id\":3,\"fee_code\":\"X0179\",\"amount\":215,' +
'\"fee_description\":\"Special guardianship orders (section 14A(3) or (6)(a), 14C(3) or 14D(1))\",' +
'\"fee_version\":\"3\",\"case_reference\":\"ccc111\",\"remission_amount\":15,\"remission_benefiter\":\"someone\",' +
'\"remission_authorisation\":\"auth2\",\"refund_amount\":null,\"case_fee_id\":8}]}');

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
    models.push( model );
  }

  return models;
}

export function getPaymentInstructionById(id: number) {
  const paymentInstructionModel = new PaymentInstructionModel();
  paymentInstructionModel.assign(paymentInstructionData);
  return paymentInstructionModel;
}

export function transformIntoCheckAndSubmitModel(paymentInstructions: PaymentInstructionModel[]): CheckAndSubmit[] {
  const json = [{
    'checked': false,
    'formatter': {'_locale': 'GBP'},
    'paymentId': 95,
    'date': '2018-04-20T13:56:12.460',
    'name': 'Uriah James',
    'paymentType': {'id': 'cash', 'name': 'Cash'},
    'paymentAmount': '£200.00',
    'status': 'Validated',
    'action': 'Process',
    'dailySequenceId': 1,
    'caseReference': '55',
    'fee': '£100.00',
    'remission': '-',
    'refund': null
  }, {
    'checked': false,
    'formatter': {'_locale': 'GBP'},
    'paymentId': null,
    'date': null,
    'name': null,
    'paymentType': null,
    'paymentAmount': null,
    'status': '',
    'action': '',
    'dailySequenceId': null,
    'caseReference': '55',
    'fee': '£100.00',
    'remission': '-',
    'refund': null
  }];

  const models: CheckAndSubmit[]  = [];
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
    .map(line => line.trim().replace(/ngcontent-c\d\d/g, ''))
    .join('');
}

export function createAllPayPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = 'allpay';
  payment_type.name = 'All Pay';
  return payment_type;
}

export function createPostalOrderPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = 'postal-orders';
  payment_type.name = 'Postal Order';
  return payment_type;
}

export function createCardPaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = 'cards';
  payment_type.name = 'Card';
  return payment_type;
}

export function createChequePaymentType(): PaymentTypeModel {
  const payment_type = new PaymentTypeModel();
  payment_type.id = 'cheques';
  payment_type.name = 'Cheque';
  return payment_type;
}

export function getPaymentInstructionList(): PaymentInstructionModel[] {
  const paymentInstructions: PaymentInstructionModel[] = [];
  const paymentInstruction = createPaymentInstruction();
  for (let i = 0; i < 5; i++) {
    paymentInstructions.push(paymentInstruction);
  }

  return paymentInstructions;
}


