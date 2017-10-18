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
    form.account_number = (req.body.payment_type === '1') ? req.body.account_number : '00000000'
    form.amount = req.body.amount ? (req.body.amount * 100) : undefined
    form.cases.push({
      reference: req.body.case_reference ? req.body.case_reference : '',
      sub_service_id: parseInt(req.body.sub_service, 10),
      jurisdiction1: '',
      jurisdiction2: ''
    })
    form.cheque_number = (req.body.payment_type === '1') ? req.body.cheque_number : '000000'
    form.created_by_user_id = 'user01'
    form.counter_code = ''
    form.currency = 'GBP'
    form.event_type = ''
    form.fee_code = ''
    form.payee_name = req.body.payee_name
    form.payment_receipt_type = 'post'
    form.payment_type = parseInt(req.body.payment_type, 10)
    form.service = req.body.service
    form.sort_code = (req.body.payment_type === '1') ? req.body.sort_code : '000000'
    form.updated_by_user_id = 'user02'

    try {
      const errors = await validate(form)
      if (errors.length < 1) {
        const post = await PaymentService.postToApi(form)
        res.json({ validationErrors: errors, model: post })
      } else {
        res.json({ validationErrors: errors, model: form })
      }
    } catch (error) {
      res.json(error)
    }
  })
