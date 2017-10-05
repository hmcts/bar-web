export class PostsForm {

  constructor (public service?: number, public subservice?: number, public paymentType?: number, public payeeName?: string, public amount?: string) {}

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
