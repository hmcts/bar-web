const config = require('config');
const UtilService = require('./UtilService');

const { makeHttpRequest } = UtilService;
const barUrl = config.get('bar.url');

class PaymentsLogService {
  getPaymentsLog(status, req, format = 'json') {
    let params = '';
    let json = true;
    const headers = { 'Content-Type': 'application/json' };

    if (status.length > 0) {
      params = `?status=${status}`;
    }

    // if the format isn't "json", but it's "csv", then add header
    if (format !== 'json' && format === 'csv') {
      headers.Accept = 'text/csv';
      headers['Content-Type'] = 'text/csv';
      json = false;
    }

    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions${params}`,
      method: 'GET',
      json,
      headers
    }, req);
  }

  searchPaymentsLog(query, req) {
    const params = [];

    for (const property in query) {
      // exclude properties that has a value of "All"
      if (query[property] !== 'All' && query[property] !== '') {
        params.push(`${property}=${query[property]}`);
      }
    }

    if (!query.hasOwnProperty('status')) {
      params.push('status=P');
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

    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions?${params.join('&')}`,
      method: 'GET'
    }, req);
  }

  searchPaymentsLogByDate(dates, req) {
    const { endDate, startDate } = dates;

    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions?startDate=${startDate}&endDate=${endDate}`,
      method: 'GET'
    }, req);
  }

  /**
   * Sends pending payments to API
   */
  sendPendingPayments(data, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions`,
      method: 'PATCH',
      body: data
    }, req);
  }

  /**
   * Responsible for altering payment instruction status
   */
  alterPaymentInstructionStatus(paymentInstructionId, body, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentInstructionId}`,
      method: 'PATCH',
      body
    }, req);
  }

  /**
   * Get payment by paymentID (not sequence_id)
   * @param paymentID
   */
  getPaymentById(paymentID, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentID}`,
      method: 'GET'
    }, req);
  }

  /**
   * Delete payment by paymentID (not sequence_id)
   * @param paymentID
   */
  deletePaymentById(paymentID, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentID}`,
      method: 'DELETE'
    }, req);
  }

  /**
   * Create a case number by payment ID
   * @param paymentID
   * @param body
   * @returns {*}
   */
  createCaseNumber(paymentID, body, req) {
    return makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentID}/cases`,
      method: 'POST',
      body
    }, req);
  }

  isAlpha(searchString) {
    const regExp = /^[A-Za-z]+$/;
    return searchString.match(regExp);
  }
}

module.exports = PaymentsLogService;
