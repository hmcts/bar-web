const axios = require('axios');
const config = require('config');
const barUrl = config.get('bar.url');

exports.getPaymentTypes = () => {
  return axios({
    method: 'get',
    url: `${barUrl}/payment-types`,
  })
};

exports.sendPaymentDetails = (data, type) => {
  return axios({
    method: 'post',
    url: `${barUrl}/${type}`,
    data: data
  })
};
