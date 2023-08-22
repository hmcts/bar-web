/* eslint-disable */
'use strict';

const fetch = require('node-fetch');

const idamApi = process.env.IDAM_API || 'https://idam-api.aat.platform.hmcts.net';
const barApi = process.env.BAR_API || 'http://bar-api-aat.service.core-compute-aat.internal';
const clientId ='bar_frontend';
const clientSecret = process.env.IDAM_CLIENT_SECRET;
const clientRedirectUri = process.env.BAR_CLIENT_REDIRECT_URI || 'https://bar.aat.platform.hmcts.net/oauth2/callback';
const scope = 'openid profile roles manage-user';

async function getIdamUserAccessToken(username, password) {
  let searchParams = new URLSearchParams();
  searchParams.set('grant_type', 'password');
  searchParams.set('username', username);
  searchParams.set('password', password);
  searchParams.set('client_id', clientId);
  searchParams.set('client_secret', clientSecret);
  searchParams.set('redirect_uri', clientRedirectUri);
  searchParams.set('scope', scope);

  return fetch(`${idamApi}/o/token`, {
    method: 'POST',
    body: searchParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    return response.json();
  }).then((json) => {
    return json.access_token;
  }).catch(err => {
    console.log(err);
  });
}

async function assignUserToSite(username, password, user, siteId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let myHeaders = new fetch.Headers();
  myHeaders.append("Authorization", 'Bearer ' + accessToken);

  let requestOptions = {
    method: 'POST',
    headers: myHeaders
  };

  fetch(`${barApi}/sites/${siteId}/users/${user}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function createChequePayment(username, password, siteId, chequeNumber, payerName) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    amount: 27300,
    cheque_number: chequeNumber,
    currency: 'GBP',
    payer_name: payerName,
    status: 'D'
  });

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: data
  };

  return fetch(`${barApi}/cheques`, requestOptions)
    .then(response => {
      if (response.status !== 201) {
        console.log(`Error creating a payment, response: ${response.status}`);
      }
      return response.json();
    }).then((json) => {
      console.log(`payment instruction id: ${json.statuses[0].paymentInstructionStatusReferenceKey.paymentInstructionId}`);
      return json.statuses[0].paymentInstructionStatusReferenceKey.paymentInstructionId;
    })
    .catch(error => console.log('error', error));
}

async function createCardPayment(username, password, siteId, authorizationCode, payerName) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    amount: 27300,
    authorization_code: authorizationCode,
    currency: 'GBP',
    payer_name: payerName,
    status: 'D'
  });

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: data
  };

  return fetch(`${barApi}/cards`, requestOptions)
    .then(response => {
      if (response.status !== 201) {
        console.log(`Error creating a payment, response: ${response.status}`);
      }
      return response.json();
    }).then((json) => {
      console.log(`payment instruction id: ${json.statuses[0].paymentInstructionStatusReferenceKey.paymentInstructionId}`);
      return json.statuses[0].paymentInstructionStatusReferenceKey.paymentInstructionId;
    })
    .catch(error => console.log('error', error));
}


async function createCaseFeeDetailsForPaymentInstruction(username, password, siteId, caseReference, paymentInstructionId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append('SiteId', siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    payment_instruction_id: paymentInstructionId,
    fee_code: 'FEE0219',
    amount: 27300,
    fee_description: 'Application for a grant of probate (Estate over 5000 GBP)',
    fee_version: '5',
    case_reference: caseReference
  });

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: data
  };

  return fetch(`${barApi}/fees`, requestOptions)
    .then(response => {
      return response.json();
    }).then((json) => {
      return json.case_fee_id;
    })
    .catch(error => console.log('error', error));
}

async function validateAndProcessPaymentInstructionByFeeClerk(username, password, siteId, paymentInstructionId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    action: 'Process',
    status: 'V'
  });

  let requestOptions = {
    method: 'PUT',
    headers: headers,
    body: data,
  };

  fetch(`${barApi}/payment-instructions/${paymentInstructionId}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function submitPaymentInstructionByFeeClerk(username, password, siteId, paymentInstructionId, payerName) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    payer_name: payerName,
    status: 'PA',
  });

  let requestOptions = {
    method: 'PUT',
    headers: headers,
    body: data,
  };

  fetch(`${barApi}/cheques/${paymentInstructionId}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function approveChequePaymentInstructionBySeniorFeeClerk(username, password, siteId, paymentInstructionId, payerName, bgcNum) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    payer_name: payerName,
    status: 'A',
    bgc_number: bgcNum
  });

  let requestOptions = {
    method: 'PUT',
    headers: headers,
    body: data,
  };

  fetch(`${barApi}/cheques/${paymentInstructionId}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function paymentTransferToBarByDMUser(username, password, siteId, paymentInstructionId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append("Content-Type", "application/json");

  let data = JSON.stringify({
    status: 'TTB'
  });

  let requestOptions = {
    method: 'PUT',
    headers: headers,
    body: data
  };

  fetch(`${barApi}/cheques/${paymentInstructionId}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function deleteCaseFee(username, password, siteId, caseFeeId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);

  let requestOptions = {
    method: 'DELETE',
    headers: headers
  };

  fetch(`${barApi}/fees/${caseFeeId}`, requestOptions)
    .then(response => {
      if (response.status !== 204) {
      console.log(`Error deleting the case fee, response: ${response.status}`);
      }
    }).catch(error => console.log('error', error));
}

async function deletePaymentInstruction(username, password, siteId, paymentInstructionId) {
  const accessToken = await getIdamUserAccessToken(username, password);
  let headers = new fetch.Headers();
  headers.append("SiteId", siteId);
  headers.append('Authorization', 'Bearer ' + accessToken);

  let requestOptions = {
    method: 'DELETE',
    headers: headers
  };

  fetch(`${barApi}/payment-instructions/${paymentInstructionId}`, requestOptions)
    .then(response => {
      if (response.status !== 204) {
        console.log(`Error deleting the payment instruction, response: ${response.status}`);
      }
    }).catch(error => console.log('error', error));
}

module.exports = {
  assignUserToSite, createChequePayment, createCardPayment, createCaseFeeDetailsForPaymentInstruction, validateAndProcessPaymentInstructionByFeeClerk, submitPaymentInstructionByFeeClerk, approveChequePaymentInstructionBySeniorFeeClerk, paymentTransferToBarByDMUser, deleteCaseFee, deletePaymentInstruction
};


