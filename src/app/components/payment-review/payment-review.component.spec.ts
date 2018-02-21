import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReviewComponent } from './payment-review.component';

describe('PaymentReviewComponent', () => {
  let component: PaymentReviewComponent;
  let fixture: ComponentFixture<PaymentReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
