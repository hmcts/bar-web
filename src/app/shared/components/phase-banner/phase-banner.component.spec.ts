import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseBannerComponent } from './phase-banner.component';
import { By } from '@angular/platform-browser';

describe('PhaseBannerComponent', () => {
  let component: PhaseBannerComponent;
  let fixture: ComponentFixture<PhaseBannerComponent>;

  // async before each
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseBannerComponent ] // declare the phase banner component
    })
    .compileComponents(); // then compile all the components
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseBannerComponent); // create the component
    component = fixture.componentInstance; // get the component instance
    fixture.detectChanges(); // and detect the changes
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should ensure that the phase reflects the "type" in the banner.', () => {
    const elem = fixture.debugElement.nativeElement.querySelector('.phase-tag');
    expect(elem.nativeElement.textContent.toUpperCase()).toEqual(component.type);
  });
});
