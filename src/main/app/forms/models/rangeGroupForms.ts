import { IsDefined, Matches, Max, MaxLength, Min, ValidateIf, ValidateNested } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import RangeGroup from 'fees/rangeGroup'
import { Fractions } from 'app/forms/validation/validators/fractions'
import Range from 'fees/range'
import Fee from 'fees/fee'
import _ = require('lodash')
import { IsUnique } from 'app/forms/validation/validators/isUnique'
import { FeesClient } from 'fees/feesClient'

export class ValidationErrors {
  static readonly CODE_REQUIRED: string = 'Enter code'
  static readonly CODE_TOO_LONG: string = 'Enter code no longer than $constraint1 characters'
  static readonly CODE_INVALID_CHARACTERS: string = 'Enter code containing on alphanumeric characters, underscore or dash'
  static readonly CODE_EXISTS: string = 'Enter code that does not exist'

  static readonly DESCRIPTION_REQUIRED: string = 'Enter description'
  static readonly DESCRIPTION_TOO_LONG: string = 'Enter description no longer than $constraint1 characters'

  static readonly FROM_AMOUNT_REQUIRED: string = 'Enter from amount'
  static readonly FROM_AMOUNT_NOT_NEGATIVE: string = 'Enter from amount equal or greater than zero'
  static readonly FROM_AMOUNT_TOO_BIG: string = 'Enter from amount lower than 10,000,000'
  static readonly FROM_AMOUNT_INVALID_DECIMALS: string = 'Enter from amount with maximum two decimal places'

  static readonly TO_AMOUNT_NOT_NEGATIVE: string = 'Enter to amount equal or greater than zero'
  static readonly TO_AMOUNT_TOO_BIG: string = 'Enter to amount lower than 10,000,000'
  static readonly TO_AMOUNT_INVALID_DECIMALS: string = 'Enter to amount with maximum two decimal places'
}

export class RangeForm {
  @IsDefined({message: ValidationErrors.FROM_AMOUNT_REQUIRED})
  @Min(0, {message: ValidationErrors.FROM_AMOUNT_NOT_NEGATIVE})
  @Max(9999999.99, {message: ValidationErrors.FROM_AMOUNT_TOO_BIG})
  @Fractions(0, 2, {message: ValidationErrors.FROM_AMOUNT_INVALID_DECIMALS})
  from?: number

  @ValidateIf(o => o.to !== undefined && o.to !== null)
  @Min(0, {message: ValidationErrors.TO_AMOUNT_NOT_NEGATIVE})
  @Max(9999999.99, {message: ValidationErrors.TO_AMOUNT_TOO_BIG})
  @Fractions(0, 2, {message: ValidationErrors.TO_AMOUNT_INVALID_DECIMALS})
  to?: number

  @IsDefined({message: ValidationErrors.CODE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.CODE_REQUIRED})
  @MaxLength(50, {message: ValidationErrors.CODE_TOO_LONG})
  @Matches(/^[A-Za-z0-9_-]+$/, {message: ValidationErrors.CODE_INVALID_CHARACTERS})
  feeCode?: string

  constructor (from?: number, to?: number, feeCode?: string) {
    this.from = from
    this.to = to
    this.feeCode = feeCode
  }

  static fromObject (value?: any): RangeForm {
    if (!value) {
      return value
    }

    const from = value.from ? _.toNumber(value.from) : undefined
    const to = value.to ? _.toNumber(value.to) : undefined
    const feeCode = value.feeCode ? value.feeCode : undefined

    return new RangeForm(from, to, feeCode)
  }
}

export class EditRangeGroupForm {
  @IsDefined({message: ValidationErrors.CODE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.CODE_REQUIRED})
  @MaxLength(50, {message: ValidationErrors.CODE_TOO_LONG})
  @Matches(/^[A-Za-z0-9_-]+$/, {message: ValidationErrors.CODE_INVALID_CHARACTERS})
  code?: string

  @IsDefined({message: ValidationErrors.DESCRIPTION_REQUIRED})
  @IsNotBlank({message: ValidationErrors.DESCRIPTION_REQUIRED})
  @MaxLength(2000, {message: ValidationErrors.DESCRIPTION_TOO_LONG})
  description?: string

  @ValidateNested({each: true})
  ranges?: RangeForm[]

  constructor (code?: string, description?: string, ranges?: RangeForm[]) {
    this.code = code
    this.description = description
    this.ranges = ranges.sort((a, b) => {
      let aFrom = _.isNumber(a.from) ? a.from : Number.MAX_VALUE
      let bFrom = _.isNumber(b.from) ? b.from : Number.MAX_VALUE
      return aFrom - bFrom
    })
  }

  static fromObject (value?: any): EditRangeGroupForm {
    if (!value) {
      return value
    }

    const code = value.code ? value.code : undefined
    const description = value.description ? value.description : undefined
    const ranges = value.ranges ? value.ranges.map(RangeForm.fromObject) : []

    return new EditRangeGroupForm(code, description, ranges)
  }

  addRange (): EditRangeGroupForm {
    this.ranges.push(new RangeForm())
    return this
  }

  deleteLastRange (): EditRangeGroupForm {
    this.ranges.splice(-1)
    return this
  }

  toRangeGroup (): RangeGroup {
    return new RangeGroup(this.code, this.description, this.ranges.map(range => new Range(
      Math.round(range.from * 100),
      Math.round(range.to * 100),
      new Fee(range.feeCode, null, null, null, null))
    ))
  }
}

export class CreateRangeGroupForm {
  @IsDefined({message: ValidationErrors.CODE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.CODE_REQUIRED})
  @MaxLength(50, {message: ValidationErrors.CODE_TOO_LONG})
  @Matches(/^[A-Za-z0-9_-]+$/, {message: ValidationErrors.CODE_INVALID_CHARACTERS})
  @IsUnique((value) => FeesClient.checkRangeGroupExists(value).then((exists) => !exists), {message: ValidationErrors.CODE_EXISTS})
  code?: string

  constructor (code?: string) {
    this.code = code
  }

  static fromObject (value?: any): CreateRangeGroupForm {
    if (!value) {
      return value
    }

    const code = value.code ? value.code : undefined

    return new CreateRangeGroupForm(code)
  }
}
