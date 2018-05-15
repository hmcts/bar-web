import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe  } from '@angular/common';

@Pipe({
  name: 'formatPound'
})
export class FormatPound extends CurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == null) {
        return '';
    }
    return super.transform(value, 'GBP', true, '1.2');
  }
}
