// include all of the necessary codes etc
import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatusCodes from 'http-status-codes'

// get the service URL
const serviceUrl: string = config.get<string>('bar.url')

// define function here, and export
export function getHelloEveryBody () {
  mock(serviceUrl)
    .get('/hello')
    .reply(HttpStatusCodes.OK, 'hello every one')
}
