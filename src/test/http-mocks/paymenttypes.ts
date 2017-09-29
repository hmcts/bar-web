// include all of the necessary codes etc
import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatusCodes from 'http-status-codes'

// get the service URL
const serviceUrl: string = config.get<string>('bar.url')

// define function here, and export
export function getPaymentTypes () {
  mock(serviceUrl)
    .get('/paymentTypes')
    .reply(HttpStatusCodes.OK, [
      { id: 1, name: 'Cheque' },
      { id: 2, name: 'Cash' },
      { id: 3, name: 'Payment by Account' },
      { id: 4, name: 'Postal order' },
      { id: 5, name: 'Foreign cheque' },
      { id: 6, name: 'Request to ring' }
    ])
}
