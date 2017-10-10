import * as Validator from 'class-validator'

export class PostsForm {

  @Validator.IsNumber({ message: 'This field isn\'t a valid service' })
  service?: number

  @Validator.IsNumber({ message: 'This field isn\'t a valid sub-service' })
  subService?: number

  @Validator.IsNumber({ message: 'This field isn\'t a valid service' })
  paymentType?: number

  @Validator.IsString()
  @Validator.MaxLength(50, { message: 'This field is longer than 50 characters' })
  payeeName?: string

  @Validator.IsNumber({})
  @Validator.MaxLength(6, {})
  chequeNumber?: string

  @Validator.IsNumber({})
  @Validator.MaxLength(6, {})
  chequeSortCode?: string

  @Validator.IsNumber({})
  @Validator.MaxLength(8, {})
  accountNumber?: string

  @Validator.IsCurrency({})
  amount?: string

  constructor (service?: number, subService?: number, paymentType?: number, payeeName?: string, amount?: string, chequeNumber?: string, chequeSortCode?: string, accountNumber?: string) {
    this.service = service
    this.subService = subService
    this.paymentType = paymentType
    this.payeeName = payeeName
    this.chequeNumber = chequeNumber
    this.chequeSortCode = chequeSortCode
    this.accountNumber = accountNumber
    this.amount = amount
  }

  static fromObject (value?: any): PostsForm {
    if (!value) {
      return value
    }

    const service: number = value.service ? value.service : undefined
    const subService: number = value.subService ? value.subService : undefined
    const paymentType: number = value.paymentType ? value.paymentType : undefined
    const payeeName: string = value.payeeName ? value.payeeName : undefined
    const amount: string = value.amount ? value.amount : undefined

    return new PostsForm(service, subService, paymentType, payeeName, amount)
  }

}
