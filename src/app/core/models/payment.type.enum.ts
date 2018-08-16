export class PaymentTypeEnum {
  static CARD = 'CARD';
  static CASH = 'CASH';
  static CHEQUE = 'CHEQUE';
  static POSTAL_ORDER = 'POSTAL_ORDER';
  static ALLPAY = 'ALLPAY';

  static urlMapping = {
    CARD: 'cards',
    CASH: 'cash',
    CHEQUE: 'cheques',
    POSTAL_ORDER: 'postal-orders',
    ALLPAY: 'allpay'
  };

  static getBgcTypes(): Array<string> {
    return [PaymentTypeEnum.CHEQUE, PaymentTypeEnum.POSTAL_ORDER, PaymentTypeEnum.CASH];
  }

  static getEndpointUri(type: string): string {
    return this.urlMapping[type];
  }
}

