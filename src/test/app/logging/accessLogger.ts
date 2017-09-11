import * as chai from 'chai'
import * as spies from 'chai-spies'

chai.use(spies)
const expect = chai.expect

import { AccessLogger } from 'logging/accessLogger'

describe('AccessLogger', () => {
  let accessLogger
  let req
  let res
  let errorCall
  let warnCall
  let debugCall
  let traceCall

  /* tslint:disable:no-empty allow empty for mocking */
  let logger = {
    error: (str) => {
    },
    warn: (str) => {
    }
  }
  /* tslint:enable:no-empty */

  beforeEach(() => {
    req = {}
    res = {}
    errorCall = chai.spy.on(logger, 'error')
    warnCall = chai.spy.on(logger, 'warn')
    debugCall = chai.spy.on(logger, 'debug')
    traceCall = chai.spy.on(logger, 'trace')
    accessLogger = new AccessLogger(logger)
  })

  it('should log on error level when response code is 400 Bad Request', () => {
    res.statusCode = 400
    accessLogger.log(req, res)
    expect(errorCall).to.have.been.called()
  })

  it('should log on error level when response code is 401 Unauthorised', () => {
    res.statusCode = 401
    accessLogger.log(req, res)
    expect(errorCall).to.have.been.called()
  })

  it('should log on error level when response code is 403 Forbidden', () => {
    res.statusCode = 403
    accessLogger.log(req, res)
    expect(errorCall).to.have.been.called()
  })

  it('should log on warn level when response code is 404 Not Found', () => {
    res.statusCode = 404
    accessLogger.log(req, res)
    expect(warnCall).to.have.been.called()
  })

  it('should log on debug level when response code is 422 Unprocessable entity', () => {
    res.statusCode = 422
    accessLogger.log(req, res)
    expect(debugCall).to.have.been.called()
  })

  it('should log on error level when response code is 500 Internal Server Error', () => {
    res.statusCode = 500
    accessLogger.log(req, res)
    expect(errorCall).to.have.been.called()
  })

  it('should log on trace level when response code is 200 OK', () => {
    res.statusCode = 200
    accessLogger.log(req, res)
    expect(traceCall).to.have.been.called()
  })

  describe('_buildAccessLogEntry', () => {
    it('should not include request body when it is not available', () => {
      let logEntry = accessLogger._buildAccessLogEntry(req, res)
      expect(logEntry.message).not.to.contain('Request body')
    })

    it('should not include query string when it is not available', () => {
      let logEntry = accessLogger._buildAccessLogEntry(req, res)
      expect(logEntry.message).not.to.contain('Query string')
    })

    it('should not include cookies when it is not available', () => {
      let logEntry = accessLogger._buildAccessLogEntry(req, res)
      expect(logEntry.message).not.to.contain('Cookies')
    })

    it('should set expected fields if they are provided', () => {
      req.body = '{ key: value }'
      req.query = '{ key: value }'
      req.cookies = '{ cookie: value }'
      let logEntry = accessLogger._buildAccessLogEntry(req, res)
      expect(logEntry.message)
        .to.contain('Request body')
        .and.to.contain('Query string')
        .and.to.contain('Cookies')
    })
  })
})
