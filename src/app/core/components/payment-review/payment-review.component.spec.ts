import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {PaymentReviewComponent} from './payment-review.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import {UtilService} from '../../../shared/services/util/util.service';

import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import { of } from 'rxjs';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { Observable } from 'rxjs';

const MockActivatedRoute = {
  params: of({ id: 1 }),
  queryParams: of({
    status: PaymentStatus.getPayment('Approved').code,
    paymentType: 'cash'
  })
};

describe('PaymentReviewComponent', () => {
  let component: PaymentReviewComponent;
  let fixture: ComponentFixture<PaymentReviewComponent>;
  let paymenttypeService: PaymenttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        PaymentReviewComponent,
        CardComponent,
        HmctsModalComponent
      ],
      providers: [UtilService, BarHttpClient, { provide: PaymentStateService, useClass: PaymentstateServiceMock }]
    }).overrideComponent(PaymentReviewComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: ActivatedRoute, useValue: MockActivatedRoute }
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

  it('loadPaymentInstructionModels', async() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.openedTab).toBe(1);
  });

  it('selectAllPaymentInstruction', async() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectAllPaymentInstruction();
    expect(component.allSelected).toBeTruthy();
    component.casModels.forEach(it => {
      expect(it.checked).toBeTruthy();
    });
  });

  it('selectPaymentInstruction', async() => {
    component.userId = '1';
    component.status = 'P';
    component.loadPaymentInstructionModels();
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.allSelected).toBeFalsy();
    expect(component.casModels[0].checked).toBeTruthy();
  });

  it('approve pi', async() => {
    component.userId = '1';
    component.status = 'Pending';

    let saveParam: PaymentInstructionModel;
    component.loadPaymentInstructionModels();
    spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return new Observable(observer => {
        observer.next({ success: true, data: null });
        observer.complete();
      });
    });
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.casModels[0].checked).toBeTruthy();
    expect(component.allSelected).toBeFalsy();

    component.onSubmission('approve', 'bgc123');
    expect(saveParam.status).toEqual(
      PaymentStatus.getPayment('Approved').code
    );

    component.onSubmission('transferredtobar');
    expect(saveParam.status).toEqual(
      PaymentStatus.getPayment('Transferred To Bar').code
    );
  });

  it('getPaymentInstructionsByFees', () => {
    expect(component.casModels.length).toBe(20);
    const pis = [createPaymentInstruction()];
    const cas = component.getPaymentInstructionsByFees(pis);
    expect(cas.length).toBe(22);
  });

  it('should leave casModels as it already is', () => {
    const paymentInstructions = component.getPaymentInstructionsByFees(
      undefined
    );
    expect(paymentInstructions).toBe(component.casModels);
  });

  it('when check selected to approve we set bgc', async () => {
    component.userId = '1';
    component.status = 'Pending';
    let saveParam: PaymentInstructionModel;
    component.loadPaymentInstructionModels();
    spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return of(true);
    });
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.casModels[0].checked).toBeTruthy();
    expect(component.allSelected).toBeFalsy();
    const bgcNumber = 'bgc123';
    const siteCode = '31';
    await component.onSubmission('approve', (siteCode.concat(bgcNumber)));
    expect(saveParam.status).toEqual(
      PaymentStatus.getPayment('Approved').code
    );
    expect(saveParam.bgc_number).toEqual(siteCode.concat(bgcNumber));
  });

  it('when check selected to approve and we don\'t have bgc we should fail', async () => {
    component.userId = '1';
    component.status = 'Pending';
    let saveParam: PaymentInstructionModel;
    component.loadPaymentInstructionModels();
    spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return of(true);
    });
    await fixture.whenStable();
    fixture.detectChanges();
    component.selectPaymentInstruction(component.casModels[0]);
    expect(component.casModels[0].checked).toBeTruthy();
    expect(component.allSelected).toBeFalsy();
    const bgcNumber = 'bgc123';
    component.onSubmission('approve');
    expect(saveParam).toEqual(undefined);
  });

  it('should allocate the appropriate "userId", "status" and "paymentType".', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.userId.toString()).toEqual('1');
    expect(component.status).toEqual(
      PaymentStatus.getPayment('Pending').code
    );
    expect(component.paymentType).toEqual('cash');
  });
});
