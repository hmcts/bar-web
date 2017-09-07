import Fee from 'app/fees/fee'
import RangeGroup from 'fees/rangeGroup'

export default class Category {
  constructor (public code: string, public description: string, public rangeGroup: RangeGroup, public fees: Array<Fee>) {
    this.code = code
    this.description = description
    this.rangeGroup = rangeGroup
    this.fees = fees
  }
}
