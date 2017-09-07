import * as _ from 'lodash'
import { IsDefined, Matches, Max, MaxLength, Min, ValidateIf } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { Fractions } from 'app/forms/validation/validators/fractions'
import Fee from 'app/fees/fee'
import { IsUnique } from 'app/forms/validation/validators/isUnique'
import { FeesClient } from 'fees/feesClient'

export class ValidationErrors {
  static readonly CODE_REQUIRED: string = 'Enter code'
  static readonly CODE_TOO_LONG: string = 'Enter code no longer than $constraint1 characters'
  static readonly CODE_INVALID_CHARACTERS: string = 'Enter code containing on alphanumeric characters, underscore or dash'
  static readonly CODE_EXISTS: string = 'Enter code that does not exist'

  static readonly DESCRIPTION_REQUIRED: string = 'Enter description'
  static readonly DESCRIPTION_TOO_LONG: string = 'Enter description no longer than $constraint1 characters'

  static readonly TYPE_REQUIRED: string = 'Enter type'

  static readonly AMOUNT_REQUIRED: string = 'Enter amount'
  static readonly AMOUNT_NOT_NEGATIVE: string = 'Enter amount equal or greater than zero'
  static readonly AMOUNT_TOO_BIG: string = 'Enter amount lower than 10,000,000'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter amount with maximum two decimal places'

  static readonly PERCENTAGE_REQUIRED: string = 'Enter percentage'
  static readonly PERCENTAGE_GREATER_THAN_0: string = 'Enter percentage greater than 0'
  static readonly PERCENTAGE_LOWER_THAN_100: string = 'Enter percentage equal or lower than 100'
  static readonly PERCENTAGE_INVALID_DECIMALS: string = 'Enter percentage with maximum two decimal places'
}

export class EditFeeForm {
  @IsDefined({message: ValidationErrors.CODE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.CODE_REQUIRED})
  @MaxLength(50, {message: ValidationErrors.CODE_TOO_LONG})
  @Matches(/^[A-Za-z0-9_-]+$/, {message: ValidationErrors.CODE_INVALID_CHARACTERS})
  code?: string

  @IsDefined({message: ValidationErrors.TYPE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.TYPE_REQUIRED})
  type?: string

  @IsDefined({message: ValidationErrors.DESCRIPTION_REQUIRED})
  @IsNotBlank({message: ValidationErrors.DESCRIPTION_REQUIRED})
  @MaxLength(2000, {message: ValidationErrors.DESCRIPTION_TOO_LONG})
  description?: string

  @ValidateIf(o => o.type === 'fixed')
  @IsDefined({message: ValidationErrors.AMOUNT_REQUIRED})
  @Min(0, {message: ValidationErrors.AMOUNT_NOT_NEGATIVE})
  @Max(9999999.99, {message: ValidationErrors.AMOUNT_TOO_BIG})
  @Fractions(0, 2, {message: ValidationErrors.AMOUNT_INVALID_DECIMALS})
  amount?: number

  @ValidateIf(o => o.type === 'percentage')
  @IsDefined({message: ValidationErrors.PERCENTAGE_REQUIRED})
  @Min(0.01, {message: ValidationErrors.PERCENTAGE_GREATER_THAN_0})
  @Max(100, {message: ValidationErrors.PERCENTAGE_LOWER_THAN_100})
  @Fractions(0, 2, {message: ValidationErrors.PERCENTAGE_INVALID_DECIMALS})
  percentage?: number

  constructor (code?: string, type?: string, description?: string, amount?: number, percentage?: number) {
    this.code = code
    this.type = type
    this.description = description
    this.amount = amount
    this.percentage = percentage
  }

  static fromObject (value?: any): EditFeeForm {
    if (!value) {
      return value
    }

    const code = value.code ? value.code : undefined
    const type = value.type ? value.type : undefined
    const description = value.description ? value.description : undefined
    const amount = value.amount ? _.toNumber(value.amount) : undefined
    const percentage = value.percentage ? _.toNumber(value.percentage) : undefined

    return new EditFeeForm(code, type, description, amount, percentage)
  }

  toFee (): Fee {
    return new Fee(this.code, this.type, this.description, Math.round(this.amount * 100), this.percentage)
  }
}

export class CreateFeeForm {
  @IsDefined({message: ValidationErrors.CODE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.CODE_REQUIRED})
  @MaxLength(50, {message: ValidationErrors.CODE_TOO_LONG})
  @Matches(/[A-Za-z0-9_-]+/, {message: ValidationErrors.CODE_INVALID_CHARACTERS})
  @IsUnique((value) => FeesClient.checkFeeExists(value).then((exists) => !exists), {message: ValidationErrors.CODE_EXISTS})
  code?: string

  @IsDefined({message: ValidationErrors.TYPE_REQUIRED})
  @IsNotBlank({message: ValidationErrors.TYPE_REQUIRED})
  type?: string

  constructor (code?: string, type?: string) {
    this.code = code
    this.type = type
  }

  static fromObject (value?: any): CreateFeeForm {
    if (!value) {
      return value
    }

    const code = value.code ? value.code : undefined
    const type = value.type ? value.type : undefined

    return new CreateFeeForm(code, type)
  }
}
