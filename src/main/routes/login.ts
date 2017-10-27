import * as express from 'express'
import { Paths } from 'bar/paths'

export default express.Router()
  .get(Paths.loginPage.uri, (req: express.Request, res: express.Response) => {

    res.render('login/index', {})
  })
