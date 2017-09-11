import { expect } from 'chai'
//import * as config from 'config'
import * as request from 'supertest'
import { app } from '../../../../main/app'
import '../../../routes/expectations'

//const cookieName: string = config.get<string>('session.cookieName')

describe('BARS Application Test: ', () => {
	it('Should return true.', () => {
		expect(false).to.equal(false)
	})

	it('GET /', (done) => {
		request(app)
			.get('/hello')
			.expect(200)
			.end((error, response) => {
				expect(response).to.be.successful.withText('hello every body')
			})
	})
})
