const config = require('config');
const BaseService = require('./BaseService');

const barUrl = config.get('bar.url');

class PaymentInstructionService extends BaseService {
  getByIdamId(userId, query, req) {
    const params = this.prepareQueryString(query);

    return this.request({
      uri: `${barUrl}/users/${userId}/payment-instructions?${params.join('&')}`,
      method: 'GET'
    }, req);
  }

  prepareQueryString(query) {
    const params = [];

    for (const property in query) {
      // exclude properties that has a value of "All"
      if (query[property] !== 'All' && query[property] !== '') {
        params.push(`${property}=${query[property]}`);
      }
    }

    if (query.hasOwnProperty('caseReference') && query.caseReference !== '') {
      if (!isNaN(query.caseReference)) {
        params.push(`dailySequenceId=${query.caseReference}`);
        params.push(`chequeNumber=${query.caseReference}`);
        params.push(`postalOrderNumber=${query.caseReference}`);
      } else if (this.isAlpha(query.caseReference)) {
        params.push(`payerName=${query.caseReference}`);
      } else {
        params.push(`caseReference=${query.caseReference}`);
      }
    }

    return params;
  }
}

module.exports = PaymentInstructionService;
