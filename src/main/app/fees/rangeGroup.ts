import Range from 'app/fees/range'

export default class RangeGroup {

  constructor (public code: string, public description: string, public ranges: Array<Range>) {
    this.code = code
    this.description = description
    this.ranges = ranges
  }
}
