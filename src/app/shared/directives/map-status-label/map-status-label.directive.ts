import { Directive, ElementRef} from '@angular/core';
@Directive({
   selector: '[appMapStatusLabel]'
})

export class MapStatusLabelDirective {
  private mapping = {
    'Approved': 'Approved',
    'Transferred to bar': 'Approved',
    'Pending Approval': 'Pending Review'
  };

  constructor(element: ElementRef) {
    element.nativeElement.addEventListener('DOMCharacterDataModified', event => {
      this.relpaceText(element.nativeElement);
      }, false);
    if (element.nativeElement.innerText) {
      this.relpaceText(element.nativeElement);
    }
  }

  relpaceText(element) {
    const text: string = element.innerText;
    element.innerText = Object.keys(this.mapping).reduce((txt, key) => {
        return txt.replace(key, this.mapping[key]);
    }, text);
  }
}
