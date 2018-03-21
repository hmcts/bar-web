import {TestBed, ComponentFixture} from '@angular/core/testing';
import {RefundComponent} from './refund.component';
import {FormsModule} from '@angular/forms';

describe('Component: Refund', () => {

  let component: RefundComponent;
  let fixture: ComponentFixture<RefundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RefundComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(RefundComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('display refund amount when there is already a refund', () => {
    component.initComponent(300.333333, true);
    expect(component.refundAmount).toEqual(300.33);

    component.initComponent(300.679999, true);
    expect(component.refundAmount).toEqual(300.68);

    component.initComponent(300, true);
    component.unallocated = 500;
    expect(component.refundAmount).toEqual(300);

    component.resetComponent();
    expect(component.refundAmount).toBe(null);
    expect(component.buttonText).toEqual(RefundComponent.ADD_REFUND_TEXT);
  });

  it('display refund amount when there is no refund on the fee', () => {
    component.initComponent(null, true);
    component.unallocated = 500;
    expect(component.refundAmount).toEqual(null);
    component.refundButtonClicked();
    expect(component.refundAmount).toEqual(500);

    component.resetComponent();
    expect(component.refundAmount).toBe(null);
    expect(component.buttonText).toEqual(RefundComponent.ADD_REFUND_TEXT);
  });
});
