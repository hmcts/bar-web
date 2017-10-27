import * as Validator from 'class-validator'

export class LoginForm {
  @Validator.Min(6, { message: 'This email address is too short' })
  @Validator.IsEmail({}, { message: 'This isn\'t a valid email address' })
  @Validator.IsNotEmpty({ message: 'Email cannot be empty' })
  email: string = ''

  @Validator.Min(3, { message: 'This password is too short' })
  @Validator.IsNotEmpty({ message: 'This field cannot be empty' })
  passw: string = ''
}
