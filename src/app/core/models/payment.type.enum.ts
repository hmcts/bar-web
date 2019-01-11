import { IPaymentType } from '../interfaces/payments-log';

export class PaymentTypeEnum {
  CARD = 'CARD';
  CASH = 'CASH';
  CHEQUE = 'CHEQUE';
  POSTAL_ORDER = 'POSTAL_ORDER';
  ALLPAY = 'ALLPAY';
  FULL_REMISSION = 'FULL_REMISSION';

  urlMapping = {
    CARD: 'cards',
    CASH: 'cash',
    CHEQUE: 'cheques',
    POSTAL_ORDER: 'postal-orders',
    ALLPAY: 'allpay',
    FULL_REMISSION: 'remissions'
  };

  getBgcTypes(): Array<string> {
    return [this.CHEQUE, this.POSTAL_ORDER, this.CASH];
  }

  getEndpointUri(type: string): string {
    return this.urlMapping[this.getTypeById(type)];
  }

  getTypeById(id: string): string {
    return Object.entries(this).find(entry => entry[1] === id)[0];
  }

  // Temporary hack to preserve functionality
  configure(pTypes: IPaymentType[]) {
    pTypes.forEach(pType => {
      if (pType.id === 'CARD' || pType.id === 'cards') {
        this.CARD = pType.id;
      } else if (pType.id === 'CASH' || pType.id === 'cash') {
        this.CASH = pType.id;
      } else if (pType.id === 'CHEQUE' || pType.id === 'cheques') {
        this.CHEQUE = pType.id;
      } else if (pType.id === 'POSTAL_ORDER' || pType.id === 'postal-orders') {
        this.POSTAL_ORDER = pType.id;
      } else if (pType.id === 'ALLPAY' || pType.id === 'allpay') {
        this.ALLPAY = pType.id;
      } else if (pType.id === 'FULL_REMISSION' || pType.id === 'remissions') {
        this.FULL_REMISSION = pType.id;
      }
    });
  }
}

