import { expect } from 'chai'
import * as config from 'config'
import * as request from 'supertest'
import * as mock from 'nock'

import '../../../routes/expectations'

import { Paths as AdminPaths } from 'admin/paths'

import { app } from '../../../../main/app'

import * as feesServiceMock from '../../../http-mocks/fees'
import * as idamServiceMock from '../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Fee edit page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should render fee when fees-register returns data', async () => {
      feesServiceMock.resolveGetFee()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .get(AdminPaths.feeEditPage.uri.replace(':feeCode', 'X0001'))
        .set('Cookie', `${cookieName}=JWT`)
        .expect(res => expect(res).to.be.successful.withText('X0001', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP'))
    })
  })

  describe('on POST', () => {
    it('should display error message if validation failed', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .post(AdminPaths.feeEditPage.uri.replace(':feeCode', 'X0001'))
        .set('Cookie', `${cookieName}=JWT`)
        .send({
          'code': 'X0001',
          'type': 'fixed',
          'description': '',
          'amount': 2500
        })
        .expect(res => expect(res).to.be.successful.withText('Enter description'))
    })

    it('should update fee and redirect to fees list page', async () => {
      feesServiceMock.resolvePutFee()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .post(AdminPaths.feeEditPage.uri.replace(':feeCode', 'X0001'))
        .set('Cookie', `${cookieName}=JWT`)
        .send({
          'code': 'X0001',
          'type': 'fixed',
          'description': 'Updated Description',
          'amount': 2500
        })
        .expect(res => expect(res).to.be.redirect.toLocation(AdminPaths.feeListPage.uri))
    })
  })
})
