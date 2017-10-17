import * as express from 'express'
import * as PaymentService from 'services/payments'
import { Paths } from 'bar/paths'
import { PostsForm } from '../mvc/models/forms/postsForm'
import { Form } from '../mvc/models/forms/forms'
import { validate } from 'class-validator'
// import { FormValidator } from '../mvc/models/forms/formValidator'

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

      // create an instance of the post form
      const form = new Form(new PostsForm())

      // return response to the browser
      res.status(200).render(Paths.postRecord.associatedView, {
        services, paymentTypes, preSelectedSubServices, values, form
      })
    } catch (error) {
      res.render('posts/error', {error})
    }
  })

  .post(Paths.postRecord.uri, async (req: express.Request, res: express.Response) => {
    const form: PostsForm = new PostsForm()
    form.account_number = req.body.account_number ? req.body.account_number : '00000000'
    form.amount = req.body.amount ? req.body.amount : '0.00'
    form.cases.push({ reference: req.body.case_reference })
    form.cheque_number = req.body.cheque_number ? req.body.cheque_number : '0'
    form.created_by_user_id = 'user01'
    form.counter_code = ''
    form.currency_type = 'GBP'
    form.event_type = ''
    form.fee_code = ''
    form.payee_name = req.body.payee_name
    form.payment_date = '2017-10-11T00:00'
    form.payment_receipt_type = 'post'
    form.payment_type = req.body.payment_type
    form.service = req.body.service
    form.sort_code = req.body.sort_code ? req.body.sort_code : '000000'
    form.updated_by_user_id = 'user02'
    form.update_date = ''

    try {
      const errors = await validate(form)
      res.json({ validationErrors: errors, model: form })
    } catch (error) {
      res.json(error)
    }
  })
