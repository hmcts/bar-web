import * as express from 'express'
import * as helmet from 'helmet'

const none = '\'none\''
const self = '\'self\''
const unsafeInline = '\'unsafe-inline\''
const unsafeEval = '\'unsafe-eval\''

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {}

  enableFor (app: express.Express) {
    const scriptSrc = [self]
    const connectSrc = [self]

    if (this.developmentMode) {
      scriptSrc.push('http://localhost:35729')
      scriptSrc.push(unsafeInline)
      scriptSrc.push(unsafeEval)
      connectSrc.push('ws://localhost:35729')
    }

    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [none],
        fontSrc: [self, 'data:'],
        imgSrc: [self],
        styleSrc: [self],
        scriptSrc: scriptSrc,
        connectSrc: connectSrc,
        objectSrc: [self]
      }
    }))
  }
}
