import * as express from 'express'
import { Paths } from 'bar/paths'
import * as HttpStatusCodes from 'http-status-codes'

export default express.Router()
  .get(Paths.dashboardPage.uri, (req: express.Request, res: express.Response) => {

    res.status(HttpStatusCodes.OK).json({ message: 'You are on the dashboard page.' })
  })
