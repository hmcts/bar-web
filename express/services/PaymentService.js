const axios = require('axios');
const config = require('config');

exports.getPaymentTypes = () => {
  return axios.get(`${config.get('bar.url')}/payment-types`);
}

exports.sendPaymentDetails = (data, type) => {
  return axios.post(`${config.get('bar.url')}/payments/${type}`, data)
}
