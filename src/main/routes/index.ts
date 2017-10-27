import * as express from 'express'
import { Paths } from 'bar/paths'
import * as HttpStatusCodes from 'http-status-codes'

export default express.Router()
  .get(Paths.indexPage.uri, (req: express.Request, res: express.Response) => {

    // TEMPORARILY REDIRECT TO LOGIN PAGE FOR NOW
    res.status(HttpStatusCodes.MOVED_TEMPORARILY).redirect(Paths.loginPage.uri)
  })
