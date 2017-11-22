const axios = require('axios');
const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

exports.getPaymentTypes = () => {
  console.log( `Trying to reach: ${barUrl}/payment-types` );

  return request({
    uri: `${barUrl}/payment-types`,
    method: "GET",
    json: true
  })
};

exports.sendPaymentDetails = (data, type) => {
  console.log( `Trying to reach: ${barUrl}/${type}` );

  // overwrite the payment type
  data.payment_type = type;

  // implement this temporarily now
  // data.account_number = '00000000';
  // data.sort_code = '000000';

  console.log( data );

  return request({
    uri: `${barUrl}/${type}`,
    method: "POST",
    body: data,
    json: true
  })
};
