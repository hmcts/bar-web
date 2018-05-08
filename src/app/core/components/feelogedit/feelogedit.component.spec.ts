import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {FeelogeditComponent} from './feelogedit.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../../shared/services/user/user.service';
import {NavigationTrackerService} from '../../../shared/services/navigationtracker/navigation-tracker.service';
import {HmctsModalComponent} from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import {PaymentstateService} from '../../../shared/services/state/paymentstate.service';
import {FormatPound} from '../../../shared/pipes/format-pound.pipe';
import {PaymentStatus} from '../../models/paymentstatus.model';
import {CookieService} from 'ngx-cookie-service';
import {FeelogService} from '../../services/feelog/feelog.service';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {ModalComponent} from '../modal/modal.component';

// include mocks
import {UserServiceMock} from './../../test-mocks/user.service.mock';
import {PaymentLogServiceMock} from '../../test-mocks/payment-log.service.mock';
import {PaymentTypeServiceMock} from '../../test-mocks/payment-type.service.mock';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import {FeelogServiceMock} from '../../test-mocks/feelog.service.mock';


// ---------------------------------------------------------------------------------
let userServiceMock: any;
let paymentLogServiceMock: any;
let paymentTypeServiceMock: any;
let feeLogServiceMock: any;

let mockRouter: any;
let mockActivatedRoute: any;

// ---------------------------------------------------------------------------------


class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

class MockActivatedRoute {
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _testParams: {};

  params = this.paramsSubject.asObservable();

  get testParams() {
    return this._testParams;
  }

  set testParams(newParams: any) {
    this._testParams = newParams;
    this.paramsSubject.next(newParams);
  }
}

describe('FeelogeditComponent', () => {
  let component: FeelogeditComponent;
  let fixture: ComponentFixture<FeelogeditComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [FeelogeditComponent, HmctsModalComponent, FormatPound, ModalComponent],
      providers: [
        NavigationTrackerService,
        PaymentstateService,
        CookieService,
        {provide: FeelogService, useValue: FeelogServiceMock},
        {provide: PaymentslogService, useValue: PaymentLogServiceMock},
        {provide: PaymenttypeService, useValue: PaymentTypeServiceMock},
        {provide: UserService, useValue: UserServiceMock},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockActivatedRoute.testParams = {id: '1'};
    fixture = TestBed.createComponent(FeelogeditComponent);
    component = fixture.componentInstance;
    userServiceMock = fixture.debugElement.injector.get(UserService);
    paymentLogServiceMock = fixture.debugElement.injector.get(PaymentslogService);
    paymentTypeServiceMock = fixture.debugElement.injector.get(PaymenttypeService);
    feeLogServiceMock = fixture.debugElement.injector.get(FeelogService);
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('Should return false if payment status is not "Pending", "Validated", or "Rejected"', () => {
  //   const paymentStatus = PaymentStatus.PENDINGAPPROVAL;
  //   expect(component.checkIfValidForReturn(paymentStatus)).toBeFalsy();
  // });
  //
  // it('Should ensure that false is returned since PaymentInstructionModel status is not set to TTB', () => {
  //   expect(component.checkIfRefundExists()).toBeFalsy();
  // });
});
