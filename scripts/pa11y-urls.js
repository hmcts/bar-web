const config = require('config');

const E2E_FRONTEND_URL = config.get('e2e.frontendUrl');

module.exports = [
  `${E2E_FRONTEND_URL}/`,
  `${E2E_FRONTEND_URL}/dashboard`,
  `${E2E_FRONTEND_URL}/paymentslog`
];
