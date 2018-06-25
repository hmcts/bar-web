import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {PaymentInstructionComponent} from './payment-instruction.component';
import {ModalComponent} from './../modal/modal.component';

import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref} from '@angular/router';

import {UserService} from '../../../shared/services/user/user.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {NumbersOnlyDirective} from '../../directives/numbers-only.directive';
import {CookieService} from 'ngx-cookie-service';
import {PaymentTypeServiceMock} from '../../test-mocks/payment-type.service.mock';
import {UserServiceMock} from '../../test-mocks/user.service.mock';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymentLogServiceMock} from '../../test-mocks/payment-log.service.mock';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import {PaymentInstructionServiceMock} from '../../test-mocks/payment-instruction.service.mock';
import {By} from '@angular/platform-browser';
import {UserModel} from '../../models/user.model';
import {createPaymentInstruction, getPaymentInstructionById} from '../../../test-utils/test-utils';
import {PaymentTypeModel} from '../../models/paymenttype.model';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {PaymentStatus} from '../../models/paymentstatus.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';

describe('PaymentInstructionComponent', () => {
  let component: PaymentInstructionComponent;
  let fixture: ComponentFixture<PaymentInstructionComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let userService;

  class MockRouter {
    get url() {
      return '/change-payment';
    }

    events() {
      return new Observable(ob => {
        ob.next({});
        ob.complete();
      });
    }

    navigateByUrl(url: string) {
      return url;
    }
  }

  class MockActivatedRoute {

    get params() {
      return new Observable(observer => {
        observer.next({id: '2'}),
          observer.complete();
      });
    }
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentInstructionComponent, ModalComponent, NumbersOnlyDirective],
      providers: [
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
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.paymentTypes.length).toBe(5);
    });
  }));

  it('load payment data by id', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.model.id).toBe(3);
    });
  });

  it('on submit', (() => {
    component.model.cheque_number = '12345';
    component.onFormSubmission();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.model.cheque_number).toBe('');
    });
  }));

  it('hasPopulatedField', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.model.payer_name = 'James Dean';
      expect(component.hasPopulatedField).toBe(true);
    });
  });

  it('onPaymentInstructionSuggestion', () => {
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

  it('should add "cash" payment instruction.', () => {
    component.model = createPaymentInstruction();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = 'cash';
    paymentTypeModel.name = 'Cash';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "cheque" payment instruction.', () => {
    component.model = createPaymentInstruction();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = 'cheques';
    paymentTypeModel.name = 'Cheque';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "postal order" payment instruction.', () => {
    component.model = createPaymentInstruction();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = 'postal-orders';
    paymentTypeModel.name = 'Postal Order';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "all pay" payment instruction.', () => {
    component.model = createPaymentInstruction();
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = 'allpay';
    paymentTypeModel.name = 'AllPay';

    component.model.payment_type = paymentTypeModel;
    component.onFormSubmission();
    expect(component.newId).toEqual(component.model.id);
    expect(component.newDailySequenceId).toEqual(component.model.daily_sequence_id);
  });

  it('should add "draft" payment based on user', () => {
    const paymentTypeModel = new PaymentTypeModel();
    paymentTypeModel.id = 'cash';
    paymentTypeModel.name = 'Cash';

    component.model = createPaymentInstruction();
    component.model.payment_type = paymentTypeModel;

    // change the status to draft (and then test to see if it will be changed to "Pending"
    component.model.status = PaymentStatus.getPayment('Draft').code;

    component.onFormSubmission();
    expect(component.model.status).toBe(PaymentStatus.getPayment('Pending').code);
  });

  it('should be able to edit payment instruction', () => {
    const paymentInstructionId = 2;
    component.model = getPaymentInstructionById(paymentInstructionId);
    component.model.payer_name = 'Michael Serge';
    component.onFormSubmission();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(router.navigateByUrl).toBe('/feeclerk');
    });
  });

});
