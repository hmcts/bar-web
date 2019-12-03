import { MapStatusLabelDirective } from './map-status-label.directive';
import { ElementRef } from '@angular/core';

describe('MapStatusLabelDirective', () => {

  it('replace text in the html elment', () => {
    const nativeElement = {
      innerText: 'Transferred to bar Approved Pending Approval',
      addEventListener: () => {}
    };
    const element = new ElementRef(nativeElement);
    // tslint:disable-next-line: no-unused-expression
    new MapStatusLabelDirective(element);
    expect(nativeElement.innerText).toBe('Approved Approved Pending Review');
  });

});
