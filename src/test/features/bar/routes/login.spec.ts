import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'
import { app } from '../../../../main/app'
import '../../../routes/expectations'
import * as HttpStatusCodes from 'http-status-codes'
import { Paths } from 'bar/paths'

describe('Login Page testing', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('Bar Web App: ', () => {
    it('...should have the "blue-nav" elements in the response.', async () => {

      await request(app)
        .get(Paths.loginPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('<div class="blue-nav">')
        })
    })

    it('...should redirect to the login page by default with status code "302" (moved temporary)', async () => {

      await request(app)
        .get(Paths.indexPage.uri)
        .expect(HttpStatusCodes.MOVED_TEMPORARILY)
          .expect('Location', Paths.loginPage.uri)
    })
  })
})
