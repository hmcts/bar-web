/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import './feesClientMocks'
import { expectValidationError } from './validationUtils'
import * as _ from 'lodash'
import { CreateRangeGroupForm, EditRangeGroupForm, RangeForm, ValidationErrors } from 'app/forms/models/rangeGroupForms'

describe('EditRangeGroupForm', () => {
  function validEditRangeGroupFormWith (otherFields: any) {
    const validRangeGroup = {code: 'any', description: 'any', ranges: []}
    return EditRangeGroupForm.fromObject(_.merge(validRangeGroup, otherFields))
  }

  describe('code validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty code', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({code: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CODE_REQUIRED)
    })

    it('should reject long code', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({code: 'a'.repeat(51)}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CODE_TOO_LONG.replace('$constraint1', '50'))
    })

    it('should reject codes with invalid characters', () => {
      for (let c = 1; c < 255; c++) {
        const errors = validator.validateSync(validEditRangeGroupFormWith({code: String.fromCharCode(c)}))
        const isAllowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.indexOf(String.fromCharCode(c).toUpperCase()) > -1
        if (isAllowed) {
          expect(errors.length).to.equal(0)
        } else {
          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.CODE_INVALID_CHARACTERS)
        }
      }
    })

    it('should accept max code', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({code: 'a'.repeat(50)}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('description validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty description', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({description: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
    })

    it('should reject long description', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({description: 'a'.repeat(2001)}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DESCRIPTION_TOO_LONG.replace('$constraint1', '2000'))
    })

    it('should accept max description', () => {
      const errors = validator.validateSync(validEditRangeGroupFormWith({description: 'a'.repeat(2000)}))
      expect(errors.length).to.equal(0)
    })
  })
})

describe('RangeForm', () => {
  function validRangeFormWith (otherFields: any) {
    const validRangeGroup = {from: '0.00', to: '9999.99', feeCode: 'X0000'}
    return RangeForm.fromObject(_.merge(validRangeGroup, otherFields))
  }

  describe('ranges.from validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty amount', () => {
      const errors = validator.validateSync(validRangeFormWith({from: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FROM_AMOUNT_REQUIRED)
    })

    it('should reject negative amount', () => {
      const errors = validator.validateSync(validRangeFormWith({from: '-1'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FROM_AMOUNT_NOT_NEGATIVE)
    })

    it('should reject large amount', () => {
      const errors = validator.validateSync(validRangeFormWith({from: '10000000'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FROM_AMOUNT_TOO_BIG)
    })

    it('should reject 3 decimal places amount', () => {
      const errors = validator.validateSync(validRangeFormWith({from: '0.001'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FROM_AMOUNT_INVALID_DECIMALS)
    })

    it('should accept zero amount', () => {
      const errors = validator.validateSync(validRangeFormWith({from: '0.00'}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('ranges.to validation', () => {
    const validator: Validator = new Validator()

    it('should allow empty amount', () => {
      const errors = validator.validateSync(validRangeFormWith({to: undefined}))
      expect(errors.length).to.equal(0)
    })

    it('should reject negative amount', () => {
      const errors = validator.validateSync(validRangeFormWith({to: '-1'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TO_AMOUNT_NOT_NEGATIVE)
    })

    it('should reject large amount', () => {
      const errors = validator.validateSync(validRangeFormWith({to: '10000000'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TO_AMOUNT_TOO_BIG)
    })

    it('should reject 3 decimal places amount', () => {
      const errors = validator.validateSync(validRangeFormWith({to: '0.001'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TO_AMOUNT_INVALID_DECIMALS)
    })

    it('should accept zero amount', () => {
      const errors = validator.validateSync(validRangeFormWith({to: '0.00'}))
      expect(errors.length).to.equal(0)
    })
  })
})

describe('CreateRangeGroupForm', () => {
  function validCreateRangeGroupFormWith (otherFields: any) {
    const validRangeGroup = {code: 'any', description: 'any', ranges: []}
    return CreateRangeGroupForm.fromObject(_.merge(validRangeGroup, otherFields))
  }

  describe('code uniqueness validation', () => {
    const validator: Validator = new Validator()

    it('should allow non existing code', (done) => {
      validator.validate(validCreateRangeGroupFormWith({code: 'non-existing-range-group'})).then((errors) => {
        expect(errors.length).to.equal(0)
        done()
      })
    })

    it('should reject existing code', (done) => {
      validator.validate(validCreateRangeGroupFormWith({code: 'existing-range-group'})).then((errors) => {
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CODE_EXISTS)
        done()
      })
    })
  })
})
