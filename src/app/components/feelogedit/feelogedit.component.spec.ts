import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelogeditComponent } from './feelogedit.component';

describe('FeelogeditComponent', () => {
  let component: FeelogeditComponent;
  let fixture: ComponentFixture<FeelogeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelogeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelogeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
