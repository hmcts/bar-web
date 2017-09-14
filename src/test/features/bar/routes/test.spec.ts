import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'
import { app } from '../../../../main/app'
import * as barServiceMock from '../../../http-mocks/bars'
import '../../../routes/expectations'

// const cookieName: string = config.get<string>('session.cookieName')

describe('Categories list page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('Bar Web: ', () => {
    it('Ensure data comes from the API and prints out "hello every body"', async () => {
      barServiceMock.getHelloEveryBody()

      await request(app)
        .get('/hello')
        .expect((res) => {
          expect(res).to.be.successful.withText('hello')
        })
    })
  })
})
