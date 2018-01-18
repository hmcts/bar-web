import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  static toAsync(promise: Promise<Object>): any {
    return promise.then(data => {
      return [null, data];
    }).catch(err => {
      return [err];
    });
  }

}
