import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FeelogService } from '../../services/feelog/feelog.service';

import { PaymentInstructionListComponent } from './payment-instruction-list.component';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';
import { Observable } from 'rxjs';
import { SearchService } from '../../services/search/search.service';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { UtilService } from '../../../shared/services/util/util.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-delivery-manager', 'bar-fee-clerk']
});

describe('PaymentInstructionListComponent', () => {
  let component: PaymentInstructionListComponent;
  let fixture: ComponentFixture<PaymentInstructionListComponent>;
  let userService: UserService;
  let paymentInstructionService: PaymentInstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [CardComponent, PaymentInstructionListComponent, UpperCaseFirstPipe],
      providers: [
        SearchService,
        CookieService,
        FeelogService,
        SearchService,
        UserService,
        PaymentInstructionsService,
        UtilService,
        BarHttpClient,
        { provide: PaymentstateService, useClass: PaymentstateServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PaymentInstructionListComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    paymentInstructionService = fixture.debugElement.injector.get(PaymentInstructionsService);
    spyOn(paymentInstructionService, 'getPaymentInstructions').and.returnValue(new Observable(observer => {
      observer.next([]);
      observer.complete();
    }));
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test this method: countPaymentInstructionsByStatus()
  it('Should display the right number of payment instructions', async() => {
    const paymentInstructions: IPaymentsLog[] = [];
    fixture.detectChanges();
    expect(component.countPaymentInstructionsByStatus('Pending')).toBe(0);
  });

  // test this method: getPaymentInstructions()
  it('Check and ensure that there are payment instructions.', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.getPaymentInstructions();
      expect(component.loading).toBeFalsy();
      expect(component.paymentInstructions$.getValue().length).toEqual(0);
    });
  });

  // test this method: getPaymentInstructionsByStatus()
  it('it should reset "loading" to false.', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.getPaymentInstructions();
      expect(component.loading).toBeFalsy();
    });
  });

  it('it should alter the payment status constant and label correctly.', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.selectPaymentStatus('Pending');
      expect(component.paymentStatus.constant).toEqual(PaymentStatus.PENDING);
      expect(component.paymentStatus.label).toEqual('Pending');
    });
  });

});
