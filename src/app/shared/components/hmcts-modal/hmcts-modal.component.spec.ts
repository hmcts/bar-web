import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmctsModalComponent } from './hmcts-modal.component';

describe('HmctsModalComponent', () => {
  let component: HmctsModalComponent;
  let fixture: ComponentFixture<HmctsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
