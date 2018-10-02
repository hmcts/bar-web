import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {PaymentInstructionComponent} from './payment-instruction.component';
import {ModalComponent} from './../modal/modal.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';

import {UserService} from '../../../shared/services/user/user.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';

import {Observable, of} from 'rxjs';

import {NumbersOnlyDirective} from '../../directives/numbers-only.directive';
import {PaymentTypeServiceMock} from '../../test-mocks/payment-type.service.mock';
import {UserServiceMock} from '../../test-mocks/user.service.mock';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {PaymentInstructionServiceMock} from '../../test-mocks/payment-instruction.service.mock';
import {By} from '@angular/platform-browser';
import {
  createPaymentInstruction,
  getPaymentInstructionById,
  createChequePaymentType,
  createCashPaymentType,
  createPostalOrderPaymentType,
  createAllPayPaymentType
} from '../../../test-utils/test-utils';
import {PaymentTypeModel} from '../../models/paymenttype.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import { IPaymentType } from '../../interfaces/payments-log';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';

describe('PaymentInstructionComponent', () => {
  let component: PaymentInstructionComponent;
  let fixture: ComponentFixture<PaymentInstructionComponent>;
  let router: Router;
  let userService;

  class MockRouter {
    get url() {
      return '/change-payment';
    }

    events() {
      of({});
    }

    navigateByUrl(url: string) {
      return url;
    }
  }

  class MockActivatedRoute {
    get params() {
      return of({ id: 2 });
    }
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, ReactiveFormsModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentInstructionComponent, ModalComponent, NumbersOnlyDirective],
      providers: [
        { provide: PaymentstateService, useClass: PaymentstateServiceMock },
        BarHttpClient
      ]
    }).overrideComponent(PaymentInstructionComponent, {
      set: {
        providers: [
          {provide: PaymenttypeService, useClass: PaymentTypeServiceMock},
          {provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock},
          {provide: UserService, useClass: UserServiceMock},
          {provide: Router, useClass: MockRouter},
          {provide: ActivatedRoute, useClass: MockActivatedRoute}
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentInstructionComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    userService = fixture.debugElement.injector.get(UserService);
    paymentTypeService = fixture.debugElement.injector.get(PaymenttypeService);
    component.ngOnInit();
  });

  it('should create', async() => {
    await fixture.whenStable();
    fixture.autoDetectChanges();
    expect(component.paymentTypes$.getValue().length).toBe(5);
  });

  // TODO: This test should have never passed
  // it('load payment data by id', async() => {
  //   await fixture.whenStable();
  //   fixture.autoDetectChanges();
  //   expect(component.model.id).toBe(3);
  // });

  it('on submit', async() => {
    await fixture.whenStable();
    component.model.cheque_number = '12345';
    component.onFormSubmission();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.model.cheque_number).toBe('');
  });

  it('onPaymentInstructionSuggestion', async() => {
    await fixture.whenStable();
    component.model.cheque_number = '12345';
    component.onFormSubmission();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const debugElement = fixture.debugElement.query(By.css('.payment-suggestion'));
      expect((debugElement !== null)).toBeTruthy();

      const paymentInstructionSuggestion = debugElement.nativeElement;
      expect(component.paymentInstructionSuggestion).toBeTruthy();
      expect(component.newId).toBeTruthy();
      expect(paymentInstructionSuggestion.innerHTML).toContain(fixture.componentInstance.newId);
    });
  });

  it('should return the correct url', () => {
    component.newId = 1;
    expect(component.continueToPaymentUrl).toBe(`/feelog/edit/${component.newId}`);
  });

  it('should return the correct url', () => {
    expect(component.getPaymentInstructionListUrl).toBe(`/feelog`);
  });

  it('should get the user', () => {
    expect(component.user).toEqual(userService.getUser());
  });

  it('should add "cash" payment instruction.', async() => {
    component.onSelectPaymentType(createCashPaymentType());
    component.model = createPaymentInstruction();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const paymentTypeModel = new PaymentTypeModel();
      paymentTypeModel.id = component.paymentTypeEnum$.getValue().CASH;
      paymentTypeModel.name = 'Cash';

      component.model.payment_type = paymentTypeModel;
      component.onFormSubmission();
      expect(component.newId).toEqual(component.model.id);
      expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
    });
  });

  it('should add "cheque" payment instruction.', async() => {
    component.onSelectPaymentType(createChequePaymentType());
    component.model = createPaymentInstruction();
    fixture.whenStable().then(() => {
      fixture.autoDetectChanges();
      const paymentTypeModel = new PaymentTypeModel();
      paymentTypeModel.id = component.paymentTypeEnum$.getValue().CHEQUE;
      paymentTypeModel.name = 'Cheque';

      component.model.payment_type = paymentTypeModel;
      component.onFormSubmission();
      expect(component.newId).toEqual(component.model.id);
      expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
    });
  });

  it('should add "postal order" payment instruction.', async() => {
    component.onSelectPaymentType(createPostalOrderPaymentType());
    component.model = createPaymentInstruction();

    await fixture.whenStable();
    fixture.autoDetectChanges();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = component.paymentTypeEnum$.getValue().POSTAL_ORDER;
    paymentTypeModel.name = 'Postal Order';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "all pay" payment instruction.', async() => {
    component.onSelectPaymentType(createAllPayPaymentType());
    component.model = createPaymentInstruction();

    await fixture.whenStable();
    fixture.autoDetectChanges();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = component.paymentTypeEnum$.getValue().ALLPAY;
    paymentTypeModel.name = 'AllPay';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "draft" payment based on user', async() => {
    await fixture.whenStable();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = component.paymentTypeEnum$.getValue().CASH;
    paymentTypeModel.name = 'Cash';

    component.model = createPaymentInstruction();
    component.model.payment_type = paymentTypeModel;

    // change the status to draft (and then test to see if it will be changed to "Pending"
    component.model.status = PaymentStatus.getPayment('Draft').code;

    component.onFormSubmission();
    expect(component.model.status).toBe(PaymentStatus.getPayment('Pending').code);
  });

  it('should be able to edit payment instruction', async() => {
    const paymentInstructionId = 2;
    component.model = getPaymentInstructionById(paymentInstructionId);
    component.model.payer_name = 'Michael Serge';
    component.onFormSubmission();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(router.navigateByUrl).toBe('/feeclerk');
    });
  });

  it('should reset all the fields', () => {
    component.resetPaymentTypeFields();
    expect(component.model.all_pay_transaction_id).toBeUndefined();
    expect(component.model.authorization_code).toBeUndefined();
    expect(component.model.cheque_number).toBeUndefined();
    expect(component.model.postal_order_number).toBeUndefined();
  });

  it('should be able to alter the fields dependant "onSelectPaymentType"', async() => {
    fixture.autoDetectChanges();
    const paymentType1: IPaymentType = { id: component.paymentTypeEnum$.getValue().ALLPAY, name: 'All Pay' };
    await fixture.whenStable();
    component.onSelectPaymentType(paymentType1);
    expect(component.model.all_pay_transaction_id).toBe('');
    expect(component.model.payment_type.id).toEqual(paymentType1.id);
    expect(component.model.payment_type.name).toEqual(paymentType1.name);

    const paymentType2: IPaymentType = { id: component.paymentTypeEnum$.getValue().CARD, name: 'Card' };
    await fixture.whenStable();
    component.onSelectPaymentType(paymentType2);
    expect(component.model.authorization_code).toBe('');
    expect(component.model.payment_type.id).toEqual(paymentType2.id);
    expect(component.model.payment_type.name).toEqual(paymentType2.name);

    const paymentType3: IPaymentType = { id: component.paymentTypeEnum$.getValue().CHEQUE, name: 'Cheque' };
    await fixture.whenStable();
    component.onSelectPaymentType(paymentType3);
    expect(component.model.cheque_number).toBe('');
    expect(component.model.payment_type.id).toEqual(paymentType3.id);
    expect(component.model.payment_type.name).toEqual(paymentType3.name);

    const paymentType4: IPaymentType = { id: component.paymentTypeEnum$.getValue().POSTAL_ORDER, name: 'Postal Orders' };
    await fixture.whenStable();
    component.onSelectPaymentType(paymentType4);
    expect(component.model.postal_order_number).toBe('');
    expect(component.model.payment_type.id).toEqual(paymentType4.id);
    expect(component.model.payment_type.name).toEqual(paymentType4.name);
  });

  it('ensure that this has reset properly', () => {
    component.paymentInstructionSuggestion = !component.paymentInstructionSuggestion;
    component.addAnotherPayment();
    expect(component.model).toEqual(new PaymentInstructionModel());
    expect(component.paymentInstructionSuggestion).toBeFalsy();
  });

});
