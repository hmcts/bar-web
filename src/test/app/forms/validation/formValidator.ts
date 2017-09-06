import * as chai from 'chai'
import * as spies from 'chai-spies'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'
import { IsDefined } from 'class-validator'

import { FormValidator } from 'app/forms/validation/formValidator'

chai.use(spies)

class Person {
  @IsDefined({message: 'Name is required'})
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): Person {
    if (value == null) {
      return value
    }
    return new Person(value.name)
  }

}

describe('FormValidator', () => {
  const next = (e?: any): void => {
    return void 0
  }

  it('should deserialize request body to class instance using default mapper', (done) => {
    req.body = {name: 'John Smith'}

    FormValidator.requestHandler(Person)(req, res, next).then(() => {
      chai.expect(req.body.model).to.be.instanceof(Person)
      chai.expect(req.body.model.name).to.be.equal('John Smith')
      done()
    })
  })

  it('should deserialize request body to class instance using custom mapper', (done) => {
    req.body = {name: 'John Smith'}

    FormValidator.requestHandler(Person, Person.fromObject)(req, res, next).then(() => {
      chai.expect(req.body.model).to.be.instanceof(Person)
      chai.expect(req.body.model.name).to.be.equal('John Smith')
      done()
    })
  })

  it('should validate deserialized object', (done) => {
    req.body = {}

    FormValidator.requestHandler(Person)(req, res, next).then(() => {
      chai.expect(req.body.validationErrors.length).to.be.equal(1)
      chai.expect(req.body.validationErrors[0].property).to.be.equal('name')
      chai.expect(req.body.validationErrors[0].message).to.be.equal('Name is required')
      done()
    })
  })

  it('should not validate deserialized object when action is whitelisted', () => {
    req.body = {action: {reload: 'Reload page'}}

    FormValidator.requestHandler(Person, null, ['reload'])(req, res, next)
    chai.expect(req.body.validationErrors.length).to.be.equal(0)
  })

  it('should pass control to the next middleware', (done) => {
    const spy = chai.spy(next)

    FormValidator.requestHandler(Person)(req, res, spy).then(() => {
      chai.expect(spy).to.have.been.called()
      done()
    })
  })
})
