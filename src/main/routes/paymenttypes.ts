import * as express from 'express'
import * as PaymentService from 'common/services/payments'

export default express.Router()

  .get('/posts/record', (req: express.Request, res: express.Response) => {
    PaymentService.getPaymentTypes(paymentTypes => {
      PaymentService.getServicesWithSubservices(services => {
        const data = {
          paymentTypes,
          services
        }
        res.render('posts/index', data)
      })
    })
  })

  .get('/posts/record/services', (req: express.Request, res: express.Response) => {
    PaymentService.getServicesWithSubservices(services => {
      res.status(200).json(services)
    })
  })
