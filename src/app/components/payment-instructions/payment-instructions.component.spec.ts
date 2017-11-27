import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInstructionsComponent } from './payment-instructions.component';

describe('PaymentInstructionsComponent', () => {
  let component: PaymentInstructionsComponent;
  let fixture: ComponentFixture<PaymentInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
