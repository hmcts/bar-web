import * as express from 'express'

import { Paths } from 'bar/paths'

export default express.Router()
  .get(Paths.welcomePage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.welcomePage.associatedView)
  })
  .post(Paths.welcomePage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.categoryListPage.uri)
  })
