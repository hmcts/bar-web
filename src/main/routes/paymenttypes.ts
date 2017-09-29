import * as express from 'express'
import * as PaymentService from 'common/services/payments'

export default express.Router()

  .get('/posts/record', (req: express.Request, res: express.Response) => {
    const getServicesWithSubServices = PaymentService.getServicesWithSubservices()
    const getPaymentTypes = PaymentService.getPaymentTypes()

    getServicesWithSubServices.then(services => {
      getPaymentTypes.then(paymentTypes => {
        res.status(200).render('posts/index', {services, paymentTypes})
      })
    }).catch(error => {
      res.render('posts/error', {error})
    })
  })

  .get('/posts/record/services', (req: express.Request, res: express.Response) => {
    const getServicesWithSubServices = PaymentService.getServicesWithSubservices()

    getServicesWithSubServices
      .then(services => {
        res.status(200).json(services)
      })
  })
