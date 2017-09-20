import * as express from 'express'
import * as config from 'config'
import * as healthcheck from '@hmcts/nodejs-healthcheck'

export default express.Router()
  .get('/health', healthcheck.configure({
    checks: {
      'bar-api': basicHealthCheck('bar')
    }
  }))

function basicHealthCheck (serviceName) {
  return healthcheck.web(url(serviceName))
}

function url (serviceName: string): string {
  const healthCheckUrlLocation = `${serviceName}.healthCheckUrl`

  if (config.has(healthCheckUrlLocation)) {
    return config.get<string>(healthCheckUrlLocation)
  } else {
    return config.get<string>(`${serviceName}.url`) + '/health'
  }
}
