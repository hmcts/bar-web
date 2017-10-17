import rq from 'client/request'
import * as config from 'config'
import { PostsForm } from '../../mvc/models/forms/postsForm'

const barApiUrl = config.get<string>('bar.url')

export const getPaymentTypes = () => {
  return rq.get(`${barApiUrl}/paymentTypes`)
}

export const getServicesWithSubservices = () => {
  return rq.get(`${barApiUrl}/services`)
}

export const postToApi = (form: PostsForm) => {
  return rq
    .post({
      uri: `${barApiUrl}/payments`,
      body: form
    })
}
