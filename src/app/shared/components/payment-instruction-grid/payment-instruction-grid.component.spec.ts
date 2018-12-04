import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaymentInstructionGridComponent } from './payment-instruction-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { head } from 'lodash';
import { ICheckAndSubmit } from '../../../core/interfaces/check-and-submit';
import { FormatPound } from '../../pipes/format-pound.pipe';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';

describe('Component: PaymentInstructionGrid', () => {
  let component: PaymentInstructionGridComponent;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentInstructionGridComponent, FormatPound],
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
    const paymentInstructions = [<ICheckAndSubmit> new CheckAndSubmit().convertTo(createPaymentInstruction())];
    component.ngOnInit();
    component.models = paymentInstructions;
    expect(component.calculateAmount()).toEqual(650);
  });

  it('should select all components and should be turned on', () => {
    const paymentInstructions = [<ICheckAndSubmit> new CheckAndSubmit().convertTo(createPaymentInstruction())];
    component.ngOnInit();
    component.models = paymentInstructions;
    component.onSelectAll();
    expect(component.toggleAll).toBeTruthy();
  });

  it('should select one component, with all turned on', () => {
    const paymentInstructionModels = [<ICheckAndSubmit> new CheckAndSubmit().convertTo(createPaymentInstruction())];
    component.ngOnInit();
    component.models = paymentInstructionModels;
    const firstModel = head(component.models);
    component.onToggleChecked(firstModel);
    expect(component.toggleAll).toBeTruthy();
    expect(head(component.models).selected).toBeTruthy();
  });

  it('should emit onFormSubmission event', () => {
    const paymentInstructionModels = [createPaymentInstruction()];
    spyOn(component.onFormSubmission, 'emit').and.returnValue(paymentInstructionModels);
    component.onSubmission();
    expect(component.onFormSubmission.emit).toHaveBeenCalled();
  });

});
