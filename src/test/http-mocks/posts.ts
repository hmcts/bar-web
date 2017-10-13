import * as mock from 'nock'
import * as HttpStatusCodes from 'http-status-codes'
import * as config from 'config'
import { Paths } from 'bar/paths'
import { PostsForm } from '../../main/mvc/models/forms/postsForm'

const serviceUrl: string = config.get<string>('bar.url')

export const postPostInformation = () => {
  // populate the form
  const model = new PostsForm(1, 1, 1, 'Postman Pat', '£450')

  mock(serviceUrl)
    .post(Paths.postRecord.uri)
    .reply(HttpStatusCodes.CREATED, {
      service: model.service,
      subService: model.subService,
      paymentType: model.paymentType,
      payeeName: model.payeeName,
      amount: model.amount
    })
}
