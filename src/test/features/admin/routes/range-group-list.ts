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

describe('Range groups list page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should render range groups when fees-register returns data', async () => {
      feesServiceMock.resolveGetRangeGroups()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .get(AdminPaths.rangeGroupListPage.uri)
        .set('Cookie', `${cookieName}=JWT`)
        .expect(res => expect(res).to.be.successful.withText('range-group-code', 'Range Group Description', '<td class="numeric">2</td>'))
    })
  })

  describe('on POST', () => {
    it('should display error message if validation failed', async () => {
      feesServiceMock.resolveGetFees()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .post(AdminPaths.rangeGroupEditPage.uri.replace(':rangeGroupCode', 'range-group-update-code'))
        .set('Cookie', `${cookieName}=JWT`)
        .send({
          code: 'range-group-update-code',
          description: '',
          ranges: []
        })
        .expect(res => expect(res).to.be.successful.withText('Enter description'))
    })

    it('should update range-group and redirect to fees list page', async () => {
      feesServiceMock.resolvePutRangeGroup()
      feesServiceMock.resolveGetFees()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .post(AdminPaths.rangeGroupEditPage.uri.replace(':rangeGroupCode', 'ange-group-update-code'))
        .set('Cookie', `${cookieName}=JWT`)
        .send({
          code: 'range-group-update-code',
          description: 'description',
          ranges: []
        })
        .expect(res => expect(res).to.be.redirect.toLocation(AdminPaths.rangeGroupListPage.uri))
    })
  })
})
