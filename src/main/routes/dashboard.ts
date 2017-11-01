import * as express from 'express'
import { Paths } from 'bar/paths'
import * as HttpStatusCodes from 'http-status-codes'
import * as PaymentService from 'services/payments'

// responsible for validating uri
const ValidateClientRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // check if the user is authenticated via idam etc
  next()
}

export default express.Router()
  .get(Paths.dashboardPage.uri, (req: express.Request, res: express.Response) => {

    res.status(HttpStatusCodes.OK).render(Paths.dashboardPage.associatedView)
  })

  // this only remains in dashboard
  .get(`${Paths.apiClient.uri}/payment-types`, ValidateClientRequest, async (req: express.Request, res: express.Response) => {

    try {
      const paymentTypes = await PaymentService.getPaymentTypes()
      res.json( paymentTypes )
    } catch (error) {
      res.json({error: error})
    }
  })
