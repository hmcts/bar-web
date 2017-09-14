// import * as express from 'express'
// import * as config from 'config'

// import { Paths } from 'hello/paths'

// import * as Cookies from 'cookies'

// export default express.Router()
//   .get(Paths.loginReceiver.uri, (req: express.Request, res: express.Response) => {
//     if (req.query.jwt) {
//       const sessionCookie = config.get<string>('session.cookieName')
//       new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
//     }

//     res.redirect(Paths.welcomePage.uri)
//   })
