import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'
import { app } from '../../../../main/app'
import '../../../routes/expectations'
import * as HttpStatusCodes from 'http-status-codes'
import { Paths } from 'bar/paths'
import * as moment from 'moment'

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

    it('...should have the date in the recommended format dd/mm/yyyy', async () => {
      const todaysDate = moment().format('DD/MM/YYYY')

      await request(app)
        .get(Paths.loginPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText(todaysDate)
        })
    })

    it('...should have the login email fields available', async () => {

      await request(app)
        .get(Paths.loginPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('name="email"')
        })
    })

    it('...should have the login password fields available', async () => {

      await request(app)
        .get(Paths.loginPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('name="passw"')
        })
    })
  })
})
