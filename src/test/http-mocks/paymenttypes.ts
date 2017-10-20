// include all of the necessary codes etc
// import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatusCodes from 'http-status-codes'
import * as config from 'config'

// get the service URL
const serviceUrl: string = config.get<string>('bar.url')

// define function here, and export
export const getPaymentTypes = () => {
  mock(serviceUrl)
    .get('/paymentTypes')
    .reply(HttpStatusCodes.OK, [
      {id: 1, name: 'Cheque'},
      {id: 2, name: 'Cash'},
      {id: 3, name: 'Payment by Account'},
      {id: 4, name: 'Postal order'},
      {id: 5, name: 'Foreign cheque'},
      {id: 6, name: 'Request to ring'}
    ])
}

export const getServicesWithSubservices = () => {
  mock(serviceUrl)
    .get('/services')
    .reply(HttpStatusCodes.OK, [
      {
        id: 1,
        name: 'Civil',
        subServices: [
          {id: 1, name: 'County'},
          {id: 2, name: 'Magistrates Civil'},
          {id: 3, name: 'RCJ'}
        ]
      }
    ])
}

export const getPosts = () => {
  mock(serviceUrl)
  .get('/payments')
  .reply(HttpStatusCodes.OK, [
    {
      account_number: 'string',
      amount: 0,
      cases: [
        {
          jurisdiction1: 'string',
          jurisdiction2: 'string',
          reference: 'string',
          sub_service: {
            id: 0,
            name: 'string'
          }
        }
      ],
      cheque_number: 'string',
      counter_code: 'string',
      created_by_user_id: 'string',
      currency: 'string',
      event_type: 'string',
      fee_code: 'string',
      payee_name: 'string',
      payment_date: 'string',
      payment_receipt_type: 'string',
      payment_type: {
        id: 0,
        name: 'string'
      },
      sort_code: 'string',
      update_date: 'string',
      updated_by_user_id: 'string'
    }
  ])
}
