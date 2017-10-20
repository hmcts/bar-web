import rq from 'client/request'
import * as config from 'config'
import { PostsForm, ICase } from 'mvc/models/forms/postsForm'

const barApiUrl = config.get<string>('bar.url')

interface IPost {
  account_number: string
  cases: ICase[]
  cheque_number: string
  sort_code: string
  updated_by_user_id: string
  amount: number
  created_by_user_id: string
  counter_code: string
  currency: string
  event_type: string
  fee_code: string
  payee_name: string
  payment_receipt_type: string
  payment_type_id: number
}

export interface IPostBody {
  fromDate: string,
  toDate: string,
  userId: string
}

export const getPaymentTypes = () => {
  return rq
    .get({
      uri: `${barApiUrl}/paymentTypes`
    })
}

export const getServicesWithSubservices = () => {
  return rq
    .get({
      uri: `${barApiUrl}/services`
    })
}

export const getPosts = (data?: IPostBody) => {
  return rq
    .get({
      uri: `${barApiUrl}/payments`,
      body: data
    })
}

export const postToApi = (form: PostsForm) => {
  const data: IPost = {
    account_number: form.account_number,
    cases: form.cases,
    cheque_number: form.cheque_number,
    sort_code: form.sort_code,
    updated_by_user_id: form.updated_by_user_id,
    amount: form.amount,
    created_by_user_id: form.created_by_user_id,
    counter_code: form.counter_code,
    currency: form.currency,
    event_type: form.event_type,
    fee_code: form.fee_code,
    payee_name: form.payee_name,
    payment_receipt_type: form.payment_receipt_type,
    payment_type_id: form.payment_type
  }

  return rq
    .post({
      uri: `${barApiUrl}/payments`,
      body: data
    })
}
