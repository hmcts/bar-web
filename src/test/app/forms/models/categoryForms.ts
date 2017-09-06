/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import {expect} from 'chai'
import {Validator} from 'class-validator'
import './feesClientMocks'
import {expectValidationError} from './validationUtils'
import * as _ from 'lodash'
import {CreateCategoryForm, EditCategoryForm, ValidationErrors} from 'app/forms/models/categoryForms'

describe('EditCategoryForm', () => {
  function validEditRangeGroupFormWith (otherFields: any) {
    const validCategory = {code: 'any', description: 'any', rangeGroup : 'any' ,fees: []}
    return EditCategoryForm.fromObject(_.merge(validCategory, otherFields))
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

describe('CreateCategoryForm', () => {
  function validCreateCategoryFormWith (otherFields: any) {
    const validCategory = {code: 'any', description: 'any', rangeGroup: 'any', fees: []}
    return CreateCategoryForm.fromObject(_.merge(validCategory, otherFields))
  }

  describe('code uniqueness validation', () => {
    const validator: Validator = new Validator()

    it('should allow non existing code', (done) => {
      validator.validate(validCreateCategoryFormWith({code: 'non-existing-category'})).then((errors) => {
        expect(errors.length).to.equal(0)
        done()
      })
    })

    it('should reject existing code', (done) => {
      validator.validate(validCreateCategoryFormWith({code: 'existing-category'})).then((errors) => {
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CODE_EXISTS)
        done()
      })
    })
  })
})
