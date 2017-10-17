import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'
import { app } from '../../../../main/app'
import * as paymentTypeMock from '../../../http-mocks/paymenttypes'
// import * as postMock from '../../../http-mocks/posts'
import '../../../routes/expectations'
import { Paths } from 'bar/paths'

// const cookieName: string = config.get<string>('session.cookieName')

describe('Bar Web - Payment & Services', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('Get list of payments: ', () => {
    it('Should retrieve all the payment types and check for field "Payment by Account".', async () => {
      paymentTypeMock.getPaymentTypes()
      paymentTypeMock.getServicesWithSubservices()

      await request(app)
        .get(Paths.postRecord.uri)
        .expect((res) => {
          expect(res).to.be.successful.withText('Payment by Account')
        })
    })

    it('Should contain "Postman Pat" in the response body.', async () => {
      paymentTypeMock.getPaymentTypes()
      paymentTypeMock.getServicesWithSubservices()

      await request(app)
        .get(Paths.postRecord.uri)
        .expect(response => {
          expect(response).to.be.successful.withText('<h2>Welcome Postman Pat</h2>')
        })
    })

    it('Should ensure that the payees name isn\'t left blank or shouldn\'t equal an empty string.')

    it('Should ensure the users name is equal or less than 156 characters')

  })

})
