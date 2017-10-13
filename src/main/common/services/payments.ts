import rq from 'client/request'
import * as config from 'config'

const barApiUrl = config.get<string>('bar.url')

export const getPaymentTypes = () => {
  return rq.get(`${barApiUrl}/paymentTypes`)
}

export const getServicesWithSubservices = () => {
  return rq.get(`${barApiUrl}/services`)
}
