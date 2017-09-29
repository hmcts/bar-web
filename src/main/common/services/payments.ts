import rq from 'client/request'
// import * as config from 'config'

// const barApiUrl = config.get<string>('bar.url')
const barApiUrl = 'http://localhost:8080'

export const getPaymentTypes = () => {
  return rq.get(`${barApiUrl}/paymentTypes`)
}

export const getServicesWithSubservices = () => {
  return rq.get(`${barApiUrl}/services`)
}
