import {convertPenceToPound, convertPoundToPence} from '../util/model.utils';

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
});
