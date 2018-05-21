import {convertPenceToPound, convertPoundToPence, orderFeeDetails} from '../util/model.utils';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';
import { ICaseFeeDetail } from '../../../core/interfaces/payments-log';
import * as _ from 'lodash';

describe('Test suite for traversing json and make some conversiton', () => {

  const json = {
    stringValue: '',
    amount: 0,
    anotherAmount: 0,
    arr: [],
    emptyArr: [],
    amountObj: {}
  };

  beforeEach(() => {
    json.stringValue = 'valami';
    json.amount = 3,
    json.anotherAmount = 300,
    json.arr = [4, 5, 6, {key: 'something'}];
    json.amountObj = {
      stringValue: 'something',
      arrValue: [1, 2, 3, 4],
      amountValue: 3
    };
  });

  it('convert pound to pence in json', () => {
    const converted = convertPoundToPence(json);
    expect(converted === json).toEqual(false);
    expect(converted.stringValue).toBe('valami');
    expect(converted.amount).toBe(300);
    expect(converted.anotherAmount).toBe(30000);
    expect(converted.amountObj.stringValue).toBe('something');
    expect(converted.amountObj.amountValue).toBe(300);
    expect(converted.arr[3].key).toBe('something');
  });

  it('convert pence to pound in json', () => {
    const converted = convertPenceToPound(json);
    expect(converted === json).toEqual(false);
    expect(converted.stringValue).toBe('valami');
    expect(converted.amount).toBe(0.03);
    expect(converted.anotherAmount).toBe(3);
    expect(converted.emptyArr).toEqual([]);
    expect(converted.amountObj.stringValue).toBe('something');
    expect(converted.amountObj.amountValue).toBe(0.03);
    expect(converted.amountObj.arrValue).toEqual([1, 2, 3, 4]),
    expect(converted.arr[3].key).toBe('something');
  });

  it('order paymentinstructions', () => {
    const paymentinstruction = createPaymentInstruction();
    const feeDetails = new Array<ICaseFeeDetail>();
    paymentinstruction.case_fee_details.forEach(it => {
      feeDetails.push(it);
    });
    const negatedFeeDetail = _.cloneDeep(feeDetails[0]);
    negatedFeeDetail.amount = negatedFeeDetail.amount * -1;
    negatedFeeDetail.remission_amount = negatedFeeDetail.remission_amount * -1;
    feeDetails.push(negatedFeeDetail);
    const orderedFeeDetails = orderFeeDetails(feeDetails);
    expect(orderedFeeDetails.length).toBe(3);
    expect(orderedFeeDetails[0].amount * -1).toEqual(orderedFeeDetails[1].amount);
  });
});
