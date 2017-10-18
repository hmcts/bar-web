import * as Validator from 'class-validator'

export interface ICase {
  reference?: string,
  sub_service_id?: number
}

export class PostsForm {
  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  @Validator.IsNumberString({ message: 'Please enter a valid bank account number' })
  @Validator.MinLength(8, { message: 'Account number is less than 8 digits' })
  @Validator.MaxLength(8, { message: 'Account number is more than 8 digits' })
  account_number?: string = '00000000'

  @Validator.IsInt({})
  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  amount?: number

  cases: ICase[] = []

  @Validator.IsString({})
  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  @Validator.IsNumberString({ message: 'Cheque number should be digits' })
  @Validator.MinLength(6, { message: 'Cheque number is less than 6 digits' })
  @Validator.MaxLength(6, { message: 'Cheque number is more than 6 digits' })
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
  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  @Validator.MinLength(2, { message: 'This name is too short' })
  @Validator.MaxLength(156, { message: 'This name is too long' })
  payee_name?: string

  @Validator.IsString()
  payment_receipt_type?: string

  @Validator.IsInt({ message: 'This isn\'t a valid payment type' })
  payment_type?: number

  @Validator.IsString({ message: 'This isn\'t a valid service' })
  service?: string

  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  @Validator.IsNumberString({ message: 'Please enter a valid sort code' })
  @Validator.MinLength(6, { message: 'Sort code is less than 6 digits' })
  @Validator.MaxLength(6, { message: 'Sort code is more than 6 digits' })
  sort_code?: string = '000000'

  @Validator.IsString()
  updated_by_user_id?: string = 'string'
}
