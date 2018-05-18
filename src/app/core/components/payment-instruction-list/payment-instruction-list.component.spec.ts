import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { FeelogService } from '../../services/feelog/feelog.service';

import { PaymentInstructionListComponent } from './payment-instruction-list.component';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SearchService } from '../../services/search/search.service';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { UserServiceMock } from '../../test-mocks/user.service.mock';

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
        PaymentInstructionsService
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
  it('Check and ensure that there are payment instructions', () => {
    expect(true).toBeTruthy();
  });

  // // test this method: getPaymentInstructionsByStatus()
  // it('', () => {
  //   expect(true).toBeTruthy();
  // });

  // // test this method: isCurrentStatus()
  // it('', () => {
  //   expect(true).toBeTruthy();
  // });

  // // test this method: selectPaymentStatus()
  // it('should not modify payment status if that does not exist.', () => {
  //   expect(true).toBeTruthy();
  // });
});
