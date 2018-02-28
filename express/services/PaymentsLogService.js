const config = require('config');
const request = require('client-request/promise');

const barUrl = config.get('bar.url');

/**
 * Responsible for providing all information
 * regarding paymentlogs
 */
class PaymentsLogService {
  /**
   * Gets payment log from API
   */
  getPaymentsLog(status) {
    let params = '';
    if (status.length > 0) {
      params = `?status=${status}`;
    }

    return request({
      uri: `${barUrl}/payment-instructions${params}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Search payment log from API
   */
  searchPaymentsLog(query) {
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

    return request({
      uri: `${barUrl}/payment-instructions?${params.join('&')}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  searchPaymentsLogByDate(dates) {
    const { endDate, startDate } = dates;

    return request({
      uri: `${barUrl}/payment-instructions?startDate=${startDate}&endDate=${endDate}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Sends pending payments to API
   */
  sendPendingPayments(data) {
    return request({
      uri: `${barUrl}/payment-instructions`,
      method: 'PATCH',
      body: data,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Responsible for altering payment instruction status
   */
  alterPaymentInstructionStatus(paymentInstructionId, body) {
    return request({
      uri: `${barUrl}/payment-instructions/${paymentInstructionId}`,
      method: 'PATCH',
      body,
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Get payment by paymentID (not sequence_id)
   * @param paymentID
   */
  getPaymentById(paymentID) {
    return request({
      uri: `${barUrl}/payment-instructions/${paymentID}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Delete payment by paymentID (not sequence_id)
   * @param paymentID
   */
  deletePaymentById(paymentID) {
    return request({
      uri: `${barUrl}/payment-instructions/${paymentID}`,
      method: 'DELETE'
    });
  }

  /**
   * Create a case number by payment ID
   * @param paymentID
   * @param body
   * @returns {*}
   */
  createCaseNumber(paymentID, body) {
    return request({
      uri: `${barUrl}/payment-instructions/${paymentID}/cases`,
      method: 'POST',
      json: true,
      body,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  isAlpha(searchString) {
    const regExp = /^[A-Za-z]+$/;
    return searchString.match(regExp);
  }
}

module.exports = PaymentsLogService;
