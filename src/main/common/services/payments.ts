import rq from 'client/request'
import * as config from 'config'

const barApiUrl = config.get<string>('bar.url')

export const getPaymentTypes = (cb) => {
  rq.get(`${barApiUrl}/paymentTypes`)
    .then(response => {
      cb(response)
    })
}
