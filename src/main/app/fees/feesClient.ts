import * as config from 'config'

import request from 'client/request'
import Category from 'app/fees/category'
import Range from 'app/fees/range'
import Fee from 'app/fees/fee'
import User from 'app/idam/user'
import RangeGroup from 'fees/rangeGroup'
import {StatusCodeError} from 'request-promise-native/errors'

const feesUrl = config.get('fees.url')

export class FeesClientError extends Error {
  constructor (public message: string) {
    super(message)
    Object.setPrototypeOf(this, FeesClientError.prototype)
  }
}

function FeesClientErrorMapper (reason: Error) {
  if (reason instanceof StatusCodeError) {
    throw new FeesClientError((reason as any).response.body.message)
  } else {
    throw reason
  }
}

export class FeesClient {

  static retrieveCategories (): Promise<Array<Category>> {
    return request
      .get(`${feesUrl}/categories`)
      .then((response: Array<any>) => response.map(FeesClient.toCategory))
      .catch(FeesClientErrorMapper)
  }

  static checkCategoryExists (code: string): Promise<boolean> {
    return FeesClient.retrieveCategory(code).then(() => true).catch(() => false)
  }

  static retrieveCategory (code: string): Promise<Category> {
    return request
      .get(`${feesUrl}/categories/${code}`)
      .then(FeesClient.toCategory)
      .catch(FeesClientErrorMapper)
  }

  static updateCategory (user: User, category: Category): Promise<Category> {
    return request
          .put({
            uri: `${feesUrl}/categories/${category.code}`,
            json: true,
            headers: {
              Authorization: `Bearer ${user.bearerToken}`
            },
            body: {
              description: category.description,
              rangeGroupCode: category.rangeGroup.code,
              feeCodes: category.fees.map(fee => fee.code)
            }
          })
          .then(FeesClient.toCategory)
          .catch(FeesClientErrorMapper)
  }

  static retrieveRangeGroups (): Promise<Array<RangeGroup>> {
    return request
      .get(`${feesUrl}/range-groups`)
      .then((response: Array<any>) => response.map(FeesClient.toRangeGroup))
      .catch(FeesClientErrorMapper)
  }

  static checkRangeGroupExists (code: string): Promise<boolean> {
    return FeesClient.retrieveRangeGroup(code).then(() => true).catch(() => false)
  }

  static retrieveRangeGroup (code: string): Promise<RangeGroup> {
    return request
      .get(`${feesUrl}/range-groups/${code}`)
      .then(FeesClient.toRangeGroup)
      .catch(FeesClientErrorMapper)
  }

  static updateRangeGroup (user: User, rangeGroup: RangeGroup): Promise<RangeGroup> {
    return request
      .put({
        uri: `${feesUrl}/range-groups/${rangeGroup.code}`,
        json: true,
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        },
        body: {
          description: rangeGroup.description,
          ranges: rangeGroup.ranges.map(range => ({
            from: range.from,
            to: range.to,
            feeCode: range.fee.code
          }))
        }
      })
      .then(FeesClient.toRangeGroup)
      .catch(FeesClientErrorMapper)
  }

  static retrieveFees (): Promise<Array<Fee>> {
    return request
      .get(`${feesUrl}/fees`)
      .then((response: Array<any>) => response.map(FeesClient.toFee))
      .catch(FeesClientErrorMapper)
  }

  static checkFeeExists (code: string): Promise<boolean> {
    return FeesClient.retrieveFee(code).then(() => true).catch(() => false)
  }

  static retrieveFee (code: string): Promise<Fee> {
    return request
      .get(`${feesUrl}/fees/${code}`)
      .then(FeesClient.toFee)
      .catch(FeesClientErrorMapper)
  }

  static updateFee (user: User, fee: Fee): Promise<Fee> {
    return request
      .put({
        uri: `${feesUrl}/fees/${fee.code}`,
        json: true,
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        },
        body: fee
      })
      .then(FeesClient.toFee)
      .catch(FeesClientErrorMapper)
  }

  private static toCategory (categoryObject: any): Category {
    return new Category(
      categoryObject.code,
      categoryObject.description,
      categoryObject.rangeGroup ? FeesClient.toRangeGroup(categoryObject.rangeGroup) : null,
      FeesClient.toFees(categoryObject.fees || [])
    )
  }

  private static toRangeGroup (rangeGroupObject: any): RangeGroup {
    return new RangeGroup(
      rangeGroupObject.code,
      rangeGroupObject.description,
      FeesClient.toRanges(rangeGroupObject.ranges)
    )
  }

  private static toRanges (rangesObject: Array<any>): Array<Range> {
    return rangesObject.map(feeRangeObject => new Range(
      feeRangeObject.from,
      feeRangeObject.to,
      FeesClient.toFee(feeRangeObject.fee)
    ))
  }

  private static toFees (flatFeesObject: Array<any>): Array<Fee> {
    return flatFeesObject.map(this.toFee)
  }

  private static toFee (flatFeeObject: any): Fee {
    return new Fee(
      flatFeeObject.code,
      flatFeeObject.type,
      flatFeeObject.description,
      flatFeeObject.amount,
      flatFeeObject.percentage
    )
  }
}
