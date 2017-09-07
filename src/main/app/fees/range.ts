import Fee from 'app/fees/fee'

export default class Range {
  constructor (public from: number, public to: number, public fee: Fee) {
    this.from = from
    this.to = to
    this.fee = fee
  }
}
