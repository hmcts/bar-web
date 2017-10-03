import * as express from 'express'
import * as PaymentService from 'common/services/payments'

export default express.Router()

  .get('/posts/record', (req: express.Request, res: express.Response) => {
    PaymentService.getServicesWithSubservices().then(services => {
      let preSelectedSubServices = []
      if (services.length > 0 && typeof services[0].subServices !== 'undefined') {
        preSelectedSubServices = services[0].subServices
      }
      PaymentService.getPaymentTypes().then(paymentTypes => {
        res.status(200).render('posts/index', {services, paymentTypes, preSelectedSubServices})
      })
    }).catch(error => {
      res.render('posts/error', {error})
    })
  })

  .get('/posts/record/services', (req: express.Request, res: express.Response) => {
    PaymentService.getServicesWithSubservices().then(services => {
      res.status(200).json(services)
    })
  })
