import { PaymentInstructionModel } from '../core/models/paymentinstruction.model';
import { feelogMainCompHtml } from './feelog-main-content';
import { feelogDetailCompHtml } from './feelog-edit-content';


const data = JSON.parse('{\"payer_name\":\"Jane Doe\",\"amount\":650,\"currency\":\"GBP\",' +
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
  feeLogModel.assign(data);
  return feeLogModel;
}

export function getFeelogMainHtml() {
  return convertTxtToOneLine(feelogMainCompHtml);
}

export function getFeeLogDetailHtml() {
  return convertTxtToOneLine(feelogDetailCompHtml);
}

export function convertTxtToOneLine(text: string) {
  return text.split('\n')
    .map(line => line.trim())
    .join('');
}
