export default class Fee {
  constructor (public code: string, public type: string, public description: string, public amount: number, public percentage: number) {
    this.code = code
    this.type = type
    this.description = description
    this.amount = amount
    this.percentage = percentage
  }
}
