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
    return request({
      uri: `${barUrl}/payment-instructions?status=${status}`,
      method: 'GET',
      json: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Search payment log from API
   */
  searchPaymentsLog(searchString) {
    let barUrlForSearch = `${barUrl}/payment-instructions?status=P&`;
    if (searchString) {
      if (!isNaN(searchString)) {
        barUrlForSearch = barUrlForSearch.concat(`dailySequenceId=${searchString}&`);
        barUrlForSearch = barUrlForSearch.concat(`chequeNumber=${searchString}&`);
        barUrlForSearch = barUrlForSearch.concat(`postalOrderNumber=${searchString}`);
      } else if (this.isAlpha(searchString)) {
        barUrlForSearch = barUrlForSearch.concat(`payerName=${searchString}`);
      } else {
        barUrlForSearch = barUrlForSearch.concat(`caseReference=${searchString}`);
      }
    }

    return request({
      uri: `${barUrlForSearch}`,
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
      method: 'DELETE',
      json: true
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
