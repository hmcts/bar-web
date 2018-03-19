import { ICaseFeeDetail } from '../../../core/interfaces/payments-log';
import {FeeDetailModel} from '../../../core/models/feedetail.model';

export function traverseJson(json: any, propName = '', apply: Function, converted = {}) {
  json = propName ? json[propName] : json;
  if (json instanceof Object) {
    const keys = Object.keys(json);
    if (keys.length === 0) {
      return Array.isArray(json) ? [] : {};
    } else {
      keys.forEach((key, index) => {
        if (Array.isArray(json) && Object.keys(converted).length === 0 && converted.constructor === Object) {
          converted = [];
        }
        converted[key] = traverseJson(json, key, apply, converted[key]);
      });
      return converted;
    }
  } else {
      return apply(json, propName);
  }
}

export function convertPenceToPound(json: any, propName = '') {
  return traverseJson(json, propName, (value, key: string) => {
    if (key.toLowerCase().includes('amount')) {
      return value ? value / 100 : value;
    } else {
      return value;
    }
  });
}

export function convertPoundToPence(json: any, propName = '') {
  return traverseJson(json, propName, (value, key: string) => {
    if (key.toLowerCase().includes('amount')) {
      return value ? value * 100 : value;
    } else {
      return value;
    }
  });
}

export function orderFeeDetails(feeDetails: Array<ICaseFeeDetail>): Array<ICaseFeeDetail> {
  let deleted: Array<ICaseFeeDetail> = [];
  const active: Array<ICaseFeeDetail> = [];
  while (feeDetails.length > 0) {
    const result = searchForAbsEqualFeedetail(feeDetails);
    if (result.filtered.length > 1) {
      deleted = deleted.concat(result.filtered);
    } else {
      active.push(result.filtered[0]);
    }
    feeDetails = result.remaining;
  }
  return deleted.concat(active);
}

function searchForAbsEqualFeedetail(feeDetails: Array<ICaseFeeDetail>): SearchResult {
  const feeDetail = feeDetails[0];
  const filtered = [feeDetail];
  const remaining = [];
  for (let i = 1; i < feeDetails.length; i++) {
    const element = feeDetails[i];
    if (feeDetail.absEquals(element) && filtered.length < 2) {
      feeDetail.status = FeeDetailModel.STATUS_DISABLED;
      element.status = FeeDetailModel.STATUS_DISABLED;
      filtered.push(element);
    } else {
      remaining.push(element);
    }
  }
  filtered.sort((a, b) => {
    return b.amount - a.amount;
  });
  return { filtered, remaining };
}

interface SearchResult {
  filtered: Array<ICaseFeeDetail>;
  remaining: Array<ICaseFeeDetail>;
}
