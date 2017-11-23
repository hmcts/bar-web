const axios = require('axios');
const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

exports.getPaymentTypes = () => {
  console.log( `Trying to reach: ${barUrl}/payment-types` );

  return request({
    uri: `${barUrl}/payment-types`,
    method: "GET",
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
};

exports.sendPaymentDetails = (data, type) => {
  console.log( `Trying to reach: ${barUrl}/${type}` );
  console.log( data );

  // overwrite the payment type
  // data.payment_type = type;

  // temporary change
  data.payment_type = (type === 'cheques') ? 'cheque' : data.payment_type;

  // implement this temporarily now
  // data.account_number = '00000000';
  // data.sort_code = '000000';

  return request({
    uri: `${barUrl}/${type}`,
    method: "POST",
    body: data,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
};
