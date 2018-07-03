const config = require('config');

const barUrl = config.get('bar.url');

class PaymentInstructionService {
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getByIdamId = this.getByIdamId.bind(this);
  }

  getByIdamId(userId, query, req) {
    const params = this.prepareQueryString(query);

    return this.makeHttpRequest({
      uri: `${barUrl}/users/${userId}/payment-instructions?${params.join('&')}`,
      method: 'GET'
    }, req);
  }

  rejectPaymentInstruction(paymentInstructionId, data, req, method = 'PATCH') {
    return this.makeHttpRequest({
      uri: `${barUrl}/reject-payment-instruction/${paymentInstructionId}`,
      body: data,
      method
    }, req);
  }

  getRejectedPI(userId, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/users/${userId}/rejected-payment-instructions`,
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

  isAlpha(searchString) {
    const regExp = /^[A-Za-z]+$/;
    return searchString.match(regExp);
  }
}

module.exports = PaymentInstructionService;
