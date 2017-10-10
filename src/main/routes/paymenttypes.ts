import * as express from 'express'
import * as PaymentService from 'services/payments'
import { Paths } from 'bar/paths'
import { PostsForm } from '../mvc/models/forms/postsForm'
import { Form } from '../mvc/models/forms/forms'
import { FormValidator } from '../mvc/models/forms/formValidator'

export default express.Router()

  .get(Paths.postRecord.uri, async (req: express.Request, res: express.Response) => {
    try {
      const services = await PaymentService.getServicesWithSubservices()
      const paymentTypes = await PaymentService.getPaymentTypes()
      const values = {services, paymentTypes}
      let preSelectedSubServices = []

      if (services.length > 0 && typeof services[0].subServices !== 'undefined') {
        preSelectedSubServices = services[0].subServices
      }

      const form = new Form(new PostsForm())

      // return response to the browser
      res.status(200).render(Paths.postRecord.associatedView, {
        services, paymentTypes, preSelectedSubServices, values, form
      })
    } catch (error) {
      res.render('posts/error', {error})
    }
  })

  // this needs to be validated
  .post(Paths.postRecord.uri, FormValidator.requestHandler(PostsForm, PostsForm.fromObject), async (req: express.Request, res: express.Response) => {

    console.log( req.body )

    const form: Form<PostsForm> = req.body

    if (form.hasErrors()) {
      res.json(form)
    } else {
      res.json(req.body)
    }

  })
