import * as Validator from 'class-validator'

export interface ICase {
  reference: string,
  sub_service?: {
    name: string
  }
}

export class PostsForm {
  @Validator.IsNumberString({ message: 'Please enter a valid bank account number' })
  @Validator.MinLength(8, { message: 'Sort code must be 8 characters long' })
  @Validator.MaxLength(8, { message: 'Sort code must be 8 characters long' })
  account_number?: string = '00000000'

  @Validator.IsCurrency({})
  amount?: string = '0.00'

  cases: ICase[] = []

  @Validator.IsString({})
  @Validator.MinLength(6, { message: 'Sort code must be 6 characters long' })
  @Validator.MaxLength(6, { message: 'Sort code must be 6 characters long' })
  cheque_number?: string = '000000'

  @Validator.IsString()
  created_by_user_id?: string

  @Validator.IsString()
  counter_code?: string

  @Validator.IsString()
  currency_type?: string

  @Validator.IsString()
  event_type?: string

  @Validator.IsString()
  fee_code?: string

  @Validator.IsString()
  payment_date?: string

  @Validator.IsString()
  @Validator.MinLength(1, { message: 'Payee name cannot be left empty' })
  @Validator.MaxLength(50, { message: 'This field is longer than 50 characters' })
  payee_name?: string

  @Validator.IsString()
  payment_receipt_type?: string

  @Validator.IsNumberString({ message: 'This isn\'t a valid payment type' })
  payment_type?: string

  @Validator.IsString({ message: 'This isn\'t a valid service' })
  service?: string

  @Validator.IsNumberString({ message: 'Please enter a valid sort code' })
  @Validator.MinLength(6, { message: 'Sort code must be 6 characters long' })
  @Validator.MaxLength(6, { message: 'Sort code must be 6 characters long' })
  sort_code?: string = '000000'

  @Validator.IsString()
  updated_by_user_id?: string = 'string'

  @Validator.IsString({ message: 'This isn\'t a valid date' })
  update_date?: string
}
