import * as express from 'express'
import { Paths } from 'bar/paths'
import { Form } from '../mvc/models/forms/forms'
import { LoginForm } from 'mvc/models/forms/loginForm'

export default express.Router()
  .get(Paths.loginPage.uri, (req: express.Request, res: express.Response) => {

    const form: Form<LoginForm> = new Form(new LoginForm())
    res.render('login/index', { form })
  })

  .post(Paths.loginPage.uri, (req: express.Request, res: express.Response) => {
    const data = req.body

    res.json({ data })
  })
