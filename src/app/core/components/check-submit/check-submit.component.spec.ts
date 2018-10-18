import { ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {CheckSubmitComponent} from './check-submit.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user/user.service';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';


describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;
  let paymentInstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckSubmitComponent, CardComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])]
    });

    TestBed.overrideComponent(CheckSubmitComponent, {
      set: {
        providers: [
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    paymentInstructionsService = fixture.debugElement.injector.get(PaymentInstructionsService);
    fixture.detectChanges();
  });

  it('should create', async() => {
    await fixture.whenStable();
    expect(component.numberOfItems).toBe(10);
  });

  it('onSelectAll', () => {
    component.toggleAll = false;
    component.onSelectAll();
    component.checkAndSubmitModels$.getValue().forEach(model => {
      expect(model.checked).toBeTruthy();
    });
  });

  it('onToggleChecked', () => {
    const casModel = component.checkAndSubmitModels$.value[0];
    component.onToggleChecked(casModel);
    expect(casModel.checked).toBeTruthy();
  });

  it('onSubmission', () => {
    spyOn(paymentInstructionsService, 'savePaymentInstruction').and.callFake(param => {
      expect((<PaymentInstructionModel> param).status).toBe(PaymentStatus.PENDINGAPPROVAL);
    });
    component.onSubmission();
  });
});
