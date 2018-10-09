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
import { Observable } from 'rxjs/Observable';

describe('ApprovedPaymentsComponent', () => {
  let component: ApprovedPaymentsComponent;
  let fixture: ComponentFixture<ApprovedPaymentsComponent>;
  let paymenttypeService: PaymenttypeService;
  let spyOnSave: any;

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
    spyOnSave = () => {
      const saveParam = {param: null};
      spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
        saveParam.param = param;
        return new Observable(observer => {
          observer.next({ success: true, data: null });
          observer.complete();
        });
      });
      return saveParam;
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadPaymentInstructionModels', async() => {
    component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.openedTab).toBe(1);
  });

  it('approve pi', async() => {
    const saveParam = spyOnSave();
    component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.casModels[0].checked).toBeTruthy();
    expect(component.allSelected).toBeTruthy();

    component.onSubmission();
    expect(saveParam.param.status).toEqual(PaymentStatus.TRANSFERREDTOBAR);
  });

  it('rejeect pi', async() => {
    const saveParam = spyOnSave();
    await component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.casModels[0].checked).toBeTruthy();
    expect(component.allSelected).toBeTruthy();

    component.onSubmission('reject');
    expect(saveParam.param.status).toEqual(PaymentStatus.PENDINGAPPROVAL);
  });

  it('should select all payment instructions.', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectAllPaymentInstruction();
    expect(component.casModels.filter(casModel => casModel.checked === true).length).toBe(component.casModels.length);
  });

});
