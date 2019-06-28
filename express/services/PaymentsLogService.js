const config = require('config');
const { isNumeric } = require('validator');

const { isUndefined } = require('lodash');

const barUrl = config.get('bar.url');

class PaymentsLogService {
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
  }

  getPaymentsLog(status, req, format = 'json') {
    let json = true;
    const params = [];
    const headers = { 'Content-Type': 'application/json' };

    if (status.length > 0) {
      params.push(`status=${status}`);
    }

    if (req.query.hasOwnProperty('startDate')) {
      params.push(`startDate=${req.query.startDate}`);
    }

    // if the format isn't "json", but it's "csv", then add header
    if (format !== 'json' && format === 'csv') {
      headers.Accept = 'text/csv';
      headers['Content-Type'] = 'text/csv';
      json = false;
    }

    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions?${params}`,
      method: 'GET',
      json,
      headers
    }, req);
  }

  searchPaymentsLog(query, req) {
    const params = [];

    if (query.hasOwnProperty('status')) {
      params.push(`status=${query.status}`);
    } else {
      params.push('status=P');
    }

    if (query.hasOwnProperty('action')) {
      params.push(`action=${query.action}`);
    }

    if (query.hasOwnProperty('query') && query.query !== '') {
      params.push(`caseReference=${query.query}`);
      const payHubRegex = /^RC-|^RM-/gm;
      const regex = /^\d\d\w\d{4}$/gm;
      if (query.query.match(regex)) {
        params.push(`dailySequenceId=${query.query}`);
      } else if (isNumeric(query.query)) {
        params.push(`allPayInstructionId=${query.query}`);
        params.push(`chequeNumber=${query.query}`);
        params.push(`dailySequenceId=${query.query}`);
        params.push(`postalOrderNumber=${query.query}`);
        params.push(`authorizationCode=${query.query}`);
      } else if (query.query.match(payHubRegex)) {
        params.push(`payhubReference=${query.query}`);
      } else {
        params.push(`authorizationCode=${query.query}`);
        params.push(`payerName=${query.query}`);
      }
    }

    if (query.hasOwnProperty('startDate')) {
      params.push(`startDate=${query.startDate}`);
    }

    if (query.hasOwnProperty('endDate')) {
      params.push(`endDate=${query.endDate}`);
    }

    if (!isUndefined(query.paymentType)) {
      params.push(`paymentType=${query.paymentType}`);
    }

    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions?${params.join('&')}`,
      method: 'GET'
    }, req);
  }

  searchPaymentsLogByDate(dates, req) {
    const { endDate, startDate } = dates;

    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions?startDate=${startDate}&endDate=${endDate}`,
      method: 'GET'
    }, req);
  }

  /**
   * Sends pending payments to API
   */
  sendPendingPayments(data, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions`,
      method: 'PUT',
      body: data
    }, req);
  }

  /**
   * Responsible for altering payment instruction status
   */
  alterPaymentInstructionStatus(paymentInstructionId, body, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentInstructionId}`,
      method: 'PUT',
      body
    }, req);
  }

  /**
   * Get payment by paymentID (not sequence_id)
   * @param paymentID
   */
  getPaymentById(paymentID, req) {
    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentID}`,
      method: 'GET'
    }, req);
  }

  /**
   * Delete payment by paymentID (not sequence_id)
   * @param paymentID
   */
  deletePaymentById(paymentID, req) {
    return this.makeHttpRequest({
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
    return this.makeHttpRequest({
      uri: `${barUrl}/payment-instructions/${paymentID}/cases`,
      method: 'POST',
      body
    }, req);
  }
}

module.exports = PaymentsLogService;
