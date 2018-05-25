import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPaymentsComponent } from './approved-payments.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';

describe('ApprovedPaymentsComponent', () => {
  let component: ApprovedPaymentsComponent;
  let fixture: ComponentFixture<ApprovedPaymentsComponent>;
  let paymenttypeService: PaymenttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ApprovedPaymentsComponent, CardComponent ]
    }).overrideComponent(ApprovedPaymentsComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
        ]
      }
    });
    fixture = TestBed.createComponent(ApprovedPaymentsComponent);
    component = fixture.componentInstance;
    paymenttypeService = fixture.debugElement.injector.get(PaymenttypeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadPaymentInstructionModels', async(() => {
    component.loadPaymentInstructionModels();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.openedTab).toBe(1);
    });
  }));

  it('approve pi', async(() => {
    let saveParam: PaymentInstructionModel;
    component.loadPaymentInstructionModels();
    spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return Promise.resolve(true);
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectPaymentInstruction(component.casModels[0]);
      component.onSubmission();
      expect(saveParam.status).toEqual(PaymentStatus.TRANSFERREDTOBAR);

      component.onSubmission('reject');
      expect(saveParam.status).toEqual(PaymentStatus.PENDINGAPPROVAL);

    });
  }));

  it('should select all payment instructions.', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectAllPaymentInstruction();
      expect(component.casModels.filter(casModel => casModel.checked === true).length).toBe(component.casModels.length);
    });
  });

});
