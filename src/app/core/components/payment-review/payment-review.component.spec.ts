import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import { PaymentReviewComponent } from './payment-review.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import { UtilService } from '../../../shared/services/util/util.service';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router, RouterLinkWithHref, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { createPaymentInstruction } from '../../../test-utils/test-utils';

describe('PaymentReviewComponent', () => {
  let component: PaymentReviewComponent;
  let fixture: ComponentFixture<PaymentReviewComponent>;
  let paymenttypeService: PaymenttypeService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentReviewComponent, CardComponent ],
      providers: [
        UtilService
      ]
    }).overrideComponent(PaymentReviewComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentReviewComponent);
    component = fixture.componentInstance;
    paymenttypeService = fixture.debugElement.injector.get(PaymenttypeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadPaymentInstructionModels', async(() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.openedTab).toBe(1);
    });
  }));

  it('selectAllPaymentInstruction', async(() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectAllPaymentInstruction();
      expect(component.allSelected).toBeTruthy();
      component.casModels.forEach(it => {
        expect(it.checked).toBeTruthy();
      });
    });
  }));

  it('selectPaymentInstruction', async(() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectPaymentInstruction(component.casModels[0]);
      expect(component.allSelected).toBeFalsy();
      expect(component.casModels[0].checked).toBeTruthy();
    });
  }));

  it('approve pi', async(() => {
    component.userId = '1';
    component.status = 'Pending';
    let saveParam: PaymentInstructionModel;
    component.loadPaymentInstructionModels();
    spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return Promise.resolve(true);
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectPaymentInstruction(component.casModels[0]);
      expect(component.casModels[0].checked).toBeTruthy();
      expect(component.allSelected).toBeFalsy();

      component.onSubmission();
      expect(saveParam.status).toEqual(PaymentStatus.getPayment('Approved').code);

      component.onSubmission('reject');
      expect(saveParam.status).toEqual(PaymentStatus.getPayment('Pending Approval').code);

      component.onSubmission('reject');
      expect(saveParam.status).toEqual(PaymentStatus.getPayment('Rejected').code);

      component.onSubmission('transferredtobar');
      expect(saveParam.status).toEqual(PaymentStatus.getPayment('Transferred To Bar').code);
    });
  }));

  it('getPaymentInstructionsByFees', () => {
    const pis = [createPaymentInstruction()];
    const cas = component.getPaymentInstructionsByFees(pis);
    expect(cas.length).toBe(2);
  });

  it('should leave casModels as it already is', () => {
    const paymentInstructions = component.getPaymentInstructionsByFees(undefined);
    expect(paymentInstructions).toBe(component.casModels);
  });

});
