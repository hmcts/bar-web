import * as express from 'express'
import * as PaymentService from 'common/services/payments'

export default express.Router()

  .get('/posts/record', (req: express.Request, res: express.Response) => {
    PaymentService.getPaymentTypes(paymentTypes => {
      const data = {paymentTypes}
      res.render('posts/index', data)
    })
  })
