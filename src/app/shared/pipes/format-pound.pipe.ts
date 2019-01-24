import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatPound'
})
export class FormatPound implements PipeTransform {

  private _cp: CurrencyPipe;

  constructor() {
    this._cp = new CurrencyPipe('en-GB');
  }

  transform(value: any, useDashForNull = false): any {
    if (useDashForNull && !value) {
      return '-';
    }
    if (!useDashForNull && (value === null || value === undefined)) {
      return this._cp.transform(0, 'GBP', 'symbol', '1.2');
    }
    return this._cp.transform(value, 'GBP', 'symbol', '1.2');
  }
}
