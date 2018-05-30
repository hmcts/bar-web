import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class UtilService {

  constructor() { }

  static toAsync(promise: Promise<Object>): any {
    return promise
      .then(data => [null, data])
      .catch(err => [err]);
  }

  static convertToUpperCase(str: string) {
    const stringArray = str.toLowerCase().split(' ');
    return stringArray.map(letter => _.capitalize(letter)).join(' ');
  }

}
