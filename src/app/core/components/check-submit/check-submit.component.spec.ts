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
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { ActionFilterComponent } from '../../../shared/components/action-filter/action-filter.component';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentInstructionGridComponent } from '../../../shared/components/payment-instruction-grid/payment-instruction-grid.component';
import { PaymentAction } from '../../models/paymentaction.model';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { FormatPound } from '../../../shared/pipes/format-pound.pipe';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../test-mocks/paymentsoverview.service.mock';


describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;
  let paymentStateService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ActionFilterComponent, CheckSubmitComponent, CardComponent, PaymentInstructionGridComponent, FormatPound],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])]
    });

    TestBed.overrideComponent(CheckSubmitComponent, {
      set: {
        providers: [
          BarHttpClient,
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: PaymentStateService, useClass: PaymentstateServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    paymentStateService = fixture.debugElement.injector.get(PaymentStateService);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', async() => {
    expect(component).toBeTruthy();
    fixture.destroy();
  });

  it('should call the payment state "switchPaymentAction" method.', () => {
    spyOn(paymentStateService, 'switchPaymentAction');
    const action = { action: PaymentAction.PROCESS };
    component.switchPaymentInstructionsByAction(action);
    expect(paymentStateService.switchPaymentAction).toHaveBeenCalledWith(action);
  });

  it('should use forkJoin method on RxJS.', async() => {
    spyOn(paymentStateService, 'switchPaymentAction');
    const action = { action: PaymentAction.PROCESS };

    const paymentInstructionModels = [createPaymentInstruction()];
    component.onSubmission(paymentInstructionModels);

    await fixture.whenStable();
    fixture.detectChanges();
    expect(paymentStateService.switchPaymentAction).toHaveBeenCalledWith(action);
    expect(component.toggleAll).toBeFalsy();
  });
});
