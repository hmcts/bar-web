const axios = require('axios');
const config = require('config');
const barUrl = config.get('bar.url');

exports.getPaymentTypes = () => {
  console.log( `Trying to reach: ${barUrl}/payment-types` );

  return axios({
    method: 'get',
    url: `${barUrl}/payment-types`
  })
};

exports.sendPaymentDetails = (data, type) => {
  console.log( `Trying to reach: ${barUrl}/${type}` );

  // overwrite the payment type
  data.payment_type = type;

  // implement this temporarily now
  data.account_number = '00000000';
  data.sort_code = '000000';

  return axios({
    method: 'post',
    url: `${barUrl}/${type}`,
    data: data
  })
};
