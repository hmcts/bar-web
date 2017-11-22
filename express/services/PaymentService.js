const axios = require('axios');
const config = require('config');
const barUrl = config.get('bar.url');

console.log("barURL:",barUrl);

exports.getPaymentTypes = () => {
  console.log( `Trying to reach: ${barUrl}/payment-types` );

  return axios({
    method: 'get',
    url: `${barUrl}/payment-types`
  })
};

exports.sendPaymentDetails = (data, type) => {
  console.log( `Trying to reach: ${barUrl}/${type}` );

  return axios({
    method: 'post',
    url: `${barUrl}/${type}`,
    data: data
  })
};
