import { VisibilityDirective } from './visibility.directive';
import { FeatureService } from '../../services/feature/feature.service';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { ElementRef, DebugElement } from '@angular/core';
import { Observable } from 'rxjs';

describe('VisibilityDirective', () => {
  let featureService: FeatureService;
  let element: ElementRef;
  let directive: VisibilityDirective;

  beforeEach(() => {
    featureService = instance(mock(FeatureService));
    spyOn(featureService, 'isFeatureEnabled').and.returnValue(
      Observable.create(observer => {
        observer.next(false);
      })
    );
    element = new ElementRef(document.createElement('div'));
  });

  it('hide element when feature is not active', () => {
    directive = new VisibilityDirective(element, featureService);
    directive.ngOnInit();
    expect(element.nativeElement.hidden).toBeTruthy();
  });
});
