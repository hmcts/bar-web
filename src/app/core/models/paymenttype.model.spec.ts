import { PaymentTypeModel } from './paymenttype.model';

describe('Payment Type', () => {

  let paymenttype;

  beforeEach(() => {
    paymenttype = new PaymentTypeModel();
  });

  it('should have the data changed appropriately', () => {
    const data = { id: 123, name: 'John Doe' };
    paymenttype.assign({
      id: 123,
      name: 'John Doe'
    });

    expect(paymenttype.id).toBe(data.id);
    expect(paymenttype.name).toBe(data.name);
  });

});
