import * as Validator from 'class-validator'

export interface ICase {
  reference?: string
  sub_service_id?: number
  jurisdiction1: string
  jurisdiction2: string
}

export class PostsForm {
  @Validator.IsNotEmpty({ message: 'This field cannot be left empty' })
  @Validator.IsNumberString({ message: 'Account number should be numbers only' })
  @Validator.MinLength(8, { message: 'Account number should be 8 digits' })
  @Validator.MaxLength(8, { message: 'Account number should be 8 digits' })
  account_number?: string = '00000000'

  @Validator.IsInt({ message: 'Amount must be numbers only' })
  @Validator.IsNotEmpty({ message: 'Please enter the amount you would like to pay' })
  amount?: number

  cases: ICase[] = []

  @Validator.IsString({})
  @Validator.IsNotEmpty({ message: 'Please enter the cheque number' })
  @Validator.IsNumberString({ message: 'Cheque number should be numbers only' })
  @Validator.MinLength(6, { message: 'Cheque number should be 6 digits' })
  @Validator.MaxLength(6, { message: 'Cheque number should be 6 digits' })
  cheque_number?: string = '000000'

  @Validator.IsString()
  created_by_user_id?: string

  @Validator.IsString()
  counter_code?: string

  @Validator.IsString()
  currency?: string

  @Validator.IsString()
  event_type?: string

  @Validator.IsString()
  fee_code?: string

  @Validator.IsString()
  @Validator.IsNotEmpty({ message: 'Please enter the payee name' })
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
  @Validator.IsNumberString({ message: 'Sort code should be numbers only' })
  @Validator.MinLength(6, { message: 'Sort code should be 6 digits long' })
  @Validator.MaxLength(6, { message: 'Sort code should be 6 digits long' })
  sort_code?: string = '000000'

  @Validator.IsString()
  updated_by_user_id?: string = 'string'
}
