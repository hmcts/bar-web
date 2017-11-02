import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'
import { app } from '../../../../main/app'
import '../../../routes/expectations'
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

    it('...should have feedback link', async () => {

      await request(app)
        .get(Paths.dashboardPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('<a href="#">feedback</a>')
        })
    })

    it('...should have payment log link', async () => {

      await request(app)
        .get(Paths.dashboardPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('<a href="#">Payment log</a>')
        })
    })

    it('...should have Chris Spencer for demo', async () => {

      await request(app)
        .get(Paths.dashboardPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText('Chris Spencer')
        })
    })

    it('...should have todays date', async () => {
      const todaysDate = moment().format('DD/MM/YYYY')

      await request(app)
        .get(Paths.dashboardPage.uri)
        .expect(res => {
          expect(res).to.be.successful.withText(todaysDate)
        })
    })

    it('...should redirect to login page', async () => {

      await request(app)
        .get(Paths.logoutPage.uri)
        .expect('Location', Paths.loginPage.uri)
    })

  })
})
