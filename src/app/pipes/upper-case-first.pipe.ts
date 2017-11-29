import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperCaseFirst'
})
export class UpperCaseFirstPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const firstLetter = value.charAt(0).toUpperCase();
    return firstLetter + value.substring(1, value.length);
  }

}
