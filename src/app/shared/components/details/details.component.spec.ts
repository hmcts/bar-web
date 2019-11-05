import { DetailsComponent } from './details.component';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../core/test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {RouterModule, ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import {PaymentStatus} from '../../../core/models/paymentstatus.model';
import {PaymentInstructionsService} from '../../../core/services/payment-instructions/payment-instructions.service';
import {PaymentInstructionServiceMock} from '../../../core/test-mocks/payment-instruction.service.mock';
import {Location} from '@angular/common';
import { first } from 'lodash';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../core/models/user.model';
import { mock, instance } from 'ts-mockito';
import { CheckAndSubmit } from '../../../core/models/check-and-submit';
import { NumbersOnlyDirective } from '../../directives/numbers-only/numbers-only.directive';
import { FormatPound } from '../../pipes/format-pound.pipe';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';

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
      declarations: [DetailsComponent, NumbersOnlyDirective, FormatPound],
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
    component.action = { action: 'Process'};
    component.searchQuery = 'http://localhost:8080/users/365752/payment-instructions?paymentType=CHEQUE,POSTAL_ORDER&action=Withdraw';
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
    component.getPaymentInstructions();
    await fixture.whenStable();
    const firstPaymentInstruction = first(component.paymentInstructions$.getValue());
    component.onToggleChecked(firstPaymentInstruction);
    expect(firstPaymentInstruction.checked).toBeTruthy();
  });

  it('should return false.', async() => {
    await fixture.whenStable();
    expect(component.needsBgcNumber('CASH')).toBeTruthy();
    expect(component.needsBgcNumber('CARD')).toBeFalsy();
  });

  it('send modified payment instruction back to server', () => {
    component.approved = false;
    const checkAndSubmits = [];
    for (let i = 0; i < 3; i++) {
      const piId = i + 1;
      checkAndSubmits[i] = instance(mock(CheckAndSubmit));
      checkAndSubmits[i].paymentId = piId;
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

  it ('send modified payment instruction back to server and check for 403 status', async() => {
    component.approved = true;
   // spyOn(paymenttypeService, 'savePaymentModel').and.callThrough();
    let saveParam: PaymentInstructionModel;
    await spyOn(paymenttypeService, 'savePaymentModel').and.callFake(param => {
      saveParam = param;
      return new Observable(observer => {
        observer.next({ success: true, data: null });
        observer.complete();
      }).toPromise().catch(function(e) {
        expect(e.status).toEqual(403); // shd fail with 'bad request'status
        expect(component.isSubmitFailed).toBeTruthy();
        expect(component.bgcNumber).toBeUndefined();
      });
    });
    // await paymenttypeService.savePaymentModel(saveParam).toPromise()
    // .catch(function(e) {
    //   expect(e.status).toEqual(403); // shd fail with 'bad request'status
    //   return;
    // });
  });

  it('should clear off the bgc number on cancel', () => {
    component.toggleModal = true;
    component.bgcNumber = '311234';
    component.onCancelBgcNumber();
    expect(component.bgcNumber).toBeUndefined();
    expect(component.toggleModal).toBeFalsy();
  });

});
