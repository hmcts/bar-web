import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatPound'
})
export class FormatPound extends CurrencyPipe implements PipeTransform {

  constructor() {
    super('en-GB');
  }

  transform(value: any): any {
    if (value === null || value === undefined) {
      return '';
    }
    return super.transform(value, 'GBP', 'symbol');
  }
}
