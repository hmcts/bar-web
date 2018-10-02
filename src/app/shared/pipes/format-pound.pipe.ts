import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { isNull } from 'lodash';

@Pipe({
  name: 'formatPound'
})
export class FormatPound extends CurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (isNull(value)) {
      return '';
    }
    return super.transform(value, args);
  }
}
