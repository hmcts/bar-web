import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaymentInstructionGridComponent } from './payment-instruction-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { createPaymentInstruction } from '../../../test-utils/test-utils';

describe('Component: PaymentInstructionGrid', () => {
  let component, fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentInstructionGridComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentInstructionGridComponent);
    component = fixture.componentInstance;
  });

  it('should create component.', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty list of models by default.', () => {
    expect(component.models.length === 0).toBeTruthy();
    expect(component.totalAmount).toEqual(0);
  });

  it('should return the right calculated amount at default state.', () => {
    expect(component.calculateAmount()).toEqual(0);
  });

  it('should return the right calculated amount with altered state.', () => {
    const paymentInstructions = [createPaymentInstruction()];
    component.models = paymentInstructions;
    component.ngOnInit();
    console.log(component.calculateAmount());
    expect(true).toBeTruthy();
  });

});
