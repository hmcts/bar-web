const axios = require('axios');
const config = require('config');

exports.getPaymentTypes = () => {
  return axios({
    method: 'get',
    url: `${config.get('bar.url')}/payment-types`, 
  })
}

exports.sendPaymentDetails = (data, type) => {
  return axios({
    method: 'post',
    url: `${config.get('bar.url')}/${type}`, 
    data: data
  })
}
