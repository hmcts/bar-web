const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class PaymentService {

  getPaymentTypes() {
    return request({
      uri: `${barUrl}/payment-types`,
      method: "GET",
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  sendPaymentDetails(data, type) {
    delete data.payment_type;

    return request({
      uri: `${barUrl}/${type}`,
      method: "POST",
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getPaymentById(paymentID) {
    return new Promise(resolve => {
      resolve({
        body: {
          id: paymentID,
          all_pay_transaction_id: '',
          amount: 3999,
          cheque_number: '',
          currency: 'GBP',
          payer_name: 'Erik Tchalakov',
          payment_type: 5,
          postal_order_number: ''
        }
      });
    });
  }

}

module.exports = PaymentService;
