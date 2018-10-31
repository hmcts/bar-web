import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaymentInstructionGridComponent } from './payment-instruction-grid.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  fit('should create component', () => {
    expect(component).toBeTruthy();
  });

  fit('should have an empty list of models by default.', () => {
    expect(component.models.length === 0).toBeTruthy();
    expect(component.totalAmount).toEqual(0);
  });



});
