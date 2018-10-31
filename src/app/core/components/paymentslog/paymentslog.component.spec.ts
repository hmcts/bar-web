import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {PaymentslogComponent} from './paymentslog.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';

import {UpperCaseFirstPipe} from '../../pipes/upper-case-first.pipe';

import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only/numbers-only.directive';
import {UserService} from '../../../shared/services/user/user.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import {PaymentTypeServiceMock} from '../../test-mocks/payment-type.service.mock';
import {PaymentLogServiceMock} from '../../test-mocks/payment-log.service.mock';
import {UserServiceMock} from '../../test-mocks/user.service.mock';
import {CardComponent} from '../../../shared/components/card/card.component';
import {IPaymentsLog} from '../../interfaces/payments-log';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {BarHttpClient} from '../../../shared/services/httpclient/bar.http.client';
import {PaymentStateService} from '../../../shared/services/state/paymentstate.service';
import {PaymentstateServiceMock} from '../../test-mocks/paymentstate.service.mock';

describe('PaymentslogComponent', () => {
  let component: PaymentslogComponent;
  let fixture: ComponentFixture<PaymentslogComponent>;
  let paymentslogService: PaymentslogService;

  class MockRouter {
    get url() {
      return '/change-payment';
    }
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ CardComponent, PaymentslogComponent, UpperCaseFirstPipe, NumbersOnlyDirective ],
      providers: [
        BarHttpClient,
        { provide: PaymentStateService, useClass: PaymentstateServiceMock }
      ]
    }).overrideComponent(PaymentslogComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentslogComponent);
    component = fixture.componentInstance;
    paymentslogService = fixture.debugElement.injector.get(PaymentslogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ensure payment instruction has toggled "checked" status.', () => {
    const paymentInstruction: IPaymentsLog = new PaymentInstructionModel();
    paymentInstruction.amount = 23999;
    paymentInstruction.currency = 'GBP';
    paymentInstruction.daily_sequence_id = 31;
    paymentInstruction.payer_name = 'Mike Brown';
    paymentInstruction.payment_date = new Date();
    paymentInstruction.payment_type = { id: 'cash', name: 'Cash' };
    paymentInstruction.status = PaymentStatus.PENDING;
    component.onAlterCheckedState(paymentInstruction);
    expect(paymentInstruction.selected).toBeTruthy();
  });

  it('should check and ensure that selected payments have disappeared.', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    const paymentInstructions = component.payments_logs.map(paymentInstruction => paymentInstruction.selected = true);
    component.onFormSubmission();
    expect(component.selectAllPosts).toBeFalsy();
  });

  it('should check and ensure that deleted payments have disappeared.', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    const paymentInstructions = component.payments_logs.map(paymentInstruction => paymentInstruction.selected = true);
    component.onFormSubmissionDelete();
    expect(component.selectAllPosts).toBeFalsy();
  });

  it('should ensure that when toggle all posts works.', async() => {
    await fixture.whenStable();
    component.onSelectAllPosts();
    fixture.detectChanges();
    expect(component.payments_logs.filter(payment => payment.selected).length).toEqual(component.payments_logs.length);
  });

  it('onAlterCheckedState', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.onAlterCheckedState(component.payments_logs[0]);
    expect(component.payments_logs[0]).toBeTruthy();
  });

  it('onFormSubmission', async() => {
    component.payments_logs.forEach(pi => pi.selected = true);
    component.onFormSubmission();
    await fixture.whenStable();
    expect(component.selectAllPosts).toBeFalsy();
  });

  it('failed to getPaymentLogs', async() => {
    spyOn(paymentslogService, 'getPaymentsLog').and.callFake(() => Promise.reject('Because I said so'));
    component.getPaymentLogs();
    await fixture.whenStable();
    expect(component.payments_logs.length).toBe(0);
  });

  it('should retrieve the payments that have been submitted.', async() => {
    await fixture.whenStable();
    component.submittedPaymentCount$
      .subscribe(data => expect(data).toBe(1));
  });
});
