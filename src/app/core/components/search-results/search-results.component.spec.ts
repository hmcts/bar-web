import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchResultsComponent } from './search-results.component';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { SearchServiceMock } from '../../test-mocks/search.service.mock';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';
import { FormatPound } from '../../../shared/pipes/format-pound.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsComponent, FormatPound],
      imports: [RouterModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: PaymentStateService, useClass: PaymentstateServiceMock }]
    }).overrideComponent(SearchResultsComponent, {
      set: {
        providers: [
          { provide: SearchService, useClass: SearchServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(SearchResultsComponent);
    searchService = fixture.debugElement.injector.get(SearchService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any payment instructions', () => {
    expect(component.paymentInstructions.length).toEqual(0);
  });

  it('should not have any payment instructions and "No results found" should be displayed', () => {
    const paymentInstructions = [];
    searchService.createPaymentInstructions(paymentInstructions);
    expect(component.paymentInstructions.length).toEqual(paymentInstructions.length);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('No results found');
  });

  it('should show payment instructions with case reference', () => {
    const paymentInstructions = [createPaymentInstruction()];
    searchService.createPaymentInstructions(paymentInstructions);
    expect(component.paymentInstructions.length).toEqual(paymentInstructions.length);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('ccc111');
  });
});
