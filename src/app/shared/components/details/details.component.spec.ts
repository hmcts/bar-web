import { DetailsComponent } from './details.component';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../core/test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {RouterModule, ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import {PaymentStatus} from '../../../core/models/paymentstatus.model';
import {PaymentInstructionsService} from '../../../core/services/payment-instructions/payment-instructions.service';
import {PaymentInstructionServiceMock} from '../../../core/test-mocks/payment-instruction.service.mock';
import {Location} from '@angular/common';
import { first } from 'lodash';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../core/models/user.model';
import { mock, instance } from 'ts-mockito';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let locationService: Location;
  let paymenttypeService: PaymenttypeService;
  let paymentslogService: PaymentslogService;
  let paymentInstructionsService: PaymentInstructionsService;

  const ActivateRouteMock = {
    parent: {
      parent: {},
      params: of({ id: 1 }),
      queryParams: of({
        status: PaymentStatus.getPayment('Approved').code,
        paymentType: 'cash'
      })
    },
    params: of({ id: 1 }),
    queryParams: of({
      status: PaymentStatus.getPayment('Approved').code,
      paymentType: 'cash'
    })
  };

  const LocationMock = {
    back() {
      return 'triggered.';
    }
  };

  class MockUser {
    user: UserModel = new UserModel({
      id: 365750,
      courtId: 'BR01',
      email: 'email@hmcts.net',
      forename: 'Users',
      surname: 'Fullname',
      password: 'password',
      roles: ['bar-senior-clerk']
    });

    getUser(): UserModel {
      return this.user;
    }

    authenticate(user: UserModel) {
      return true;
    }
  }

  // trigger this method before every test
  beforeEach(async() => {
    // Prepare the mock modules
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
    }).overrideComponent(DetailsComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useValue: ActivateRouteMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: Location, useValue: LocationMock },
          { provide: UserService, useClass: MockUser }
        ]
      }
    });

    // create the mock component
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    locationService = fixture.debugElement.injector.get(Location);
    paymenttypeService = fixture.debugElement.injector.get(PaymenttypeService);
    paymentslogService = fixture.debugElement.injector.get(PaymentslogService);
    paymentInstructionsService = fixture.debugElement.injector.get(PaymentInstructionsService);
    fixture.detectChanges();
  });

  it('should create component.', () => {
    expect(component).toBeTruthy();
  });

  it('expect to go back', () => {
    spyOn(locationService, 'back');
    component.onGoBack();
    expect(locationService.back).toHaveBeenCalled();
  });

  it('should expect to have selected all payment instructions.', async() => {
    component.onSelectAll();
    await fixture.whenStable();
    const checked = component
      .paymentInstructions$
      .getValue()
      .filter(paymentInstruction => !paymentInstruction.checked);
    expect(checked.length).toBe(0);
  });

  it('should ensure that the element that\'s being checked is actually been checked.', async() => {
    await fixture.whenStable();
    const firstPaymentInstruction = first(component.paymentInstructions$.getValue());
    component.onToggleChecked(firstPaymentInstruction);
    expect(firstPaymentInstruction.checked).toBeTruthy();
  });

  it('should return false.', async() => {
    await fixture.whenStable();
    expect(component.needsBgcNumber('cash')).toBeTruthy();
    expect(component.needsBgcNumber('card')).toBeFalsy();
  });

  it('send modified payment instruction back to server', () => {
    component.approved = false;
    const checkAndSubmits = [];
    for (let i = 0; i < 3; i++) {
      checkAndSubmits[i] = instance(mock(CheckAndSubmit));
      checkAndSubmits[i].status =
        (i === 0 ? PaymentStatus.PENDINGAPPROVAL : i === 1 ? PaymentStatus.APPROVED : PaymentStatus.TRANSFERREDTOBAR);
    }
    spyOn(paymenttypeService, 'savePaymentModel').and.callThrough();
    spyOn(paymentslogService, 'rejectPaymentInstruction').and.callThrough();
    component.sendPaymentInstructions(checkAndSubmits);
    expect(paymenttypeService.savePaymentModel).toHaveBeenCalledTimes(0);
    expect(paymentslogService.rejectPaymentInstruction).toHaveBeenCalledTimes(3);
    component.approved = true;
    component.sendPaymentInstructions(checkAndSubmits);
    expect(paymenttypeService.savePaymentModel).toHaveBeenCalledTimes(3);
  });

  it('should clear off the bgc number on cancel', () => {
    component.toggleModal = true;
    component.bgcNumber = '311234';
    component.onCancelBgcNumber();
    expect(component.bgcNumber).toBeUndefined();
    expect(component.toggleModal).toBeFalsy();
  });

});
