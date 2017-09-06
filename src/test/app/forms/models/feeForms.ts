/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import './feesClientMocks'
import { expectValidationError } from './validationUtils'
import { CreateFeeForm, EditFeeForm, ValidationErrors } from 'app/forms/models/feeForms'
import * as _ from 'lodash'

import Fee from 'app/fees/fee'

describe('EditFeeForm', () => {
  function validEditFeeFormWith (otherFields: any) {
    const validFee = {code: 'any', description: 'any', type: 'fixed', amount: '10'}
    return EditFeeForm.fromObject(_.merge(validFee, otherFields))
  }

  describe('code validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty code', () => {
      const errors = validator.validateSync(validEditFeeFormWith({code: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CODE_REQUIRED)
    })

    it('should reject long code', () => {
      const errors = validator.validateSync(validEditFeeFormWith({code: 'a'.repeat(51)}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CODE_TOO_LONG.replace('$constraint1', '50'))
    })

    it('should reject codes with invalid characters', () => {
      for (let c = 1; c < 255; c++) {
        const errors = validator.validateSync(validEditFeeFormWith({code: String.fromCharCode(c)}))
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
      const errors = validator.validateSync(validEditFeeFormWith({code: 'a'.repeat(50)}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('type validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty type', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: ''}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })
  })

  describe('description validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty description', () => {
      const errors = validator.validateSync(validEditFeeFormWith({description: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
    })

    it('should reject long description', () => {
      const errors = validator.validateSync(validEditFeeFormWith({description: 'a'.repeat(2001)}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DESCRIPTION_TOO_LONG.replace('$constraint1', '2000'))
    })

    it('should accept max description', () => {
      const errors = validator.validateSync(validEditFeeFormWith({description: 'a'.repeat(2000)}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('amount validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty amount', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'fixed', amount: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject negative amount', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'fixed', amount: '-1'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_NOT_NEGATIVE)
    })

    it('should reject large amount', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'fixed', amount: '10000000'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_TOO_BIG)
    })

    it('should reject 3 decimal places amount', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'fixed', amount: '0.001'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('should accept zero amount', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'fixed', amount: '0.00'}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('percentage validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: null}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERCENTAGE_REQUIRED)
    })

    it('should reject negative percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: '-1'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERCENTAGE_GREATER_THAN_0)
    })

    it('should reject zero percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: '0.00'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERCENTAGE_GREATER_THAN_0)
    })

    it('should reject 100.01 percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: '100.01'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERCENTAGE_LOWER_THAN_100)
    })

    it('should reject 3 decimal places percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: '0.001'}))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERCENTAGE_INVALID_DECIMALS)
    })

    it('should accept 100 percentage', () => {
      const errors = validator.validateSync(validEditFeeFormWith({type: 'percentage', percentage: '100.00'}))
      expect(errors.length).to.equal(0)
    })
  })

  describe('percentage validation', () => {
    it('should convert to Fee', () => {
      let feeForm = new EditFeeForm('code', 'type', 'description', 111, 222)
      expect(feeForm.toFee()).deep.equal(new Fee('code', 'type', 'description', 11100, 222))
    })

    it('should convert float point correctly', () => {
      let feeForm = new EditFeeForm('code', 'type', 'description', 0.57, 222)
      expect(feeForm.toFee()).deep.equal(new Fee('code', 'type', 'description', 57, 222))
    })
  })
})

describe('CreateFeeForm', () => {
  function validCreateFeeFormWith (otherFields: any) {
    const validFee = {code: 'any', type: 'fixed'}
    return CreateFeeForm.fromObject(_.merge(validFee, otherFields))
  }

  describe('code uniqueness validation', () => {
    const validator: Validator = new Validator()

    it('should allow non existing code', (done) => {
      validator.validate(validCreateFeeFormWith({code: 'non-existing'})).then((errors) => {
        expect(errors.length).to.equal(0)
        done()
      })
    })

    it('should reject existing code', (done) => {
      validator.validate(validCreateFeeFormWith({code: 'existing'})).then((errors) => {
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CODE_EXISTS)
        done()
      })
    })
  })
})
