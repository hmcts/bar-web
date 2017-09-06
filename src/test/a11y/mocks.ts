import * as express from 'express'
import * as mock from 'mock-require'
import Category from 'app/fees/category'
import Range from 'app/fees/range'
import Fee from 'app/fees/fee'
import RangeGroup from 'fees/rangeGroup'

let someRangeGroup = function () {
  return new RangeGroup(
    'range-group-code',
    'Range Group Description',
    [new Range(1, 100, new Fee('X001', 'fixed', 'Some description', 100, null))]
  )
}

function someCategory () {
  return new Category(
    'online-fees',
    'Online Fees',
    someRangeGroup(),
    [new Fee('X002', 'fixed', 'Other description', 200, null)]
  )
}

function someFee () {
  return new Fee('X003', 'fixed', 'Some description', 200, null)
}

function mockUser () {
  return {id: 123, roles: ['admin', 'admin']}
}

mock('app/fees/feesClient', {
  'FeesClient': {
    retrieveCategory: (categoryCode) => Promise.resolve(someCategory()),
    retrieveCategories: () => Promise.resolve([someCategory(), someCategory(), someCategory()]),
    retrieveRangeGroups: () => Promise.resolve([someRangeGroup(), someRangeGroup()]),
    retrieveRangeGroup: (rangeGroupCode) => Promise.resolve(someRangeGroup()),
    retrieveFee: (feeCode) => Promise.resolve(someFee()),
    retrieveFees: () => Promise.resolve([someFee(), someFee(), someFee()])
  }
})

mock('idam/authorizationMiddleware', {
  AuthorizationMiddleware: {
    requestHandler: () => {
      return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.locals.user = mockUser()
        next()
      }
    }
  }
})

mock('idam/idamClient', {
  'default': {
    retrieveUserFor: (jwtToken) => mockUser()
  }
})
