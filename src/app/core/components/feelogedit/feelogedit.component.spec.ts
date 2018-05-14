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
import { FeelogMainComponent } from './main/feelog.main.component';
import { FeeDetailComponent } from './detail/feedetail.component';
import { createPaymentInstruction, getFeelogMainHtml, convertTxtToOneLine, getFeeLogDetailHtml } from '../../../test-utils/test-utils';
import { UnallocatedAmountEventMessage, FeeDetailEventMessage, EditTypes } from './detail/feedetail.event.message';
import { By } from '@angular/platform-browser';


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

  beforeEach(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [FeelogeditComponent, HmctsModalComponent, FormatPound, ModalComponent, FeelogMainComponent, FeeDetailComponent],
      providers: [
        NavigationTrackerService,
        PaymentstateService,
        CookieService
      ]
    });

    TestBed.overrideComponent(FeelogeditComponent, {
      set: {
        providers: [
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });

    mockActivatedRoute.testParams = {id: '1'};
    fixture = TestBed.createComponent(FeelogeditComponent);
    component = fixture.componentInstance;
    userServiceMock = fixture.debugElement.injector.get(UserService);
    paymentLogServiceMock = fixture.debugElement.injector.get(PaymentslogService);
    paymentTypeServiceMock = fixture.debugElement.injector.get(PaymenttypeService);
    feeLogServiceMock = fixture.debugElement.injector.get(FeelogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load payment instruction with unallocated amount', async(() => {
    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        expect(component.model).toEqual(createPaymentInstruction());
      });
  }));

  it('the fee changed to be 20 pounds more', () => {
    component.delta = new UnallocatedAmountEventMessage(20, 0, 0);
    fixture.detectChanges();
    expect(component.getUnallocatedAmount()).toBe(-2000);
  });

  it('the fee changed to be 20 pounds less', () => {
    component.delta = new UnallocatedAmountEventMessage(-20, 0, 0);
    fixture.detectChanges();
    expect(component.getUnallocatedAmount()).toBe(2000);
  });

  it('the fee became £20 more but the remission is also £20', () => {
    component.delta = new UnallocatedAmountEventMessage(20, 20, 0);
    fixture.detectChanges();
    expect(component.getUnallocatedAmount()).toBe(0);
  });

  it('£20 refund is added ', () => {
    component.delta = new UnallocatedAmountEventMessage(0, 0, 20);
    fixture.detectChanges();
    expect(component.getUnallocatedAmount()).toBe(-2000);
  });

  it('after pi load the main component should be shown and the details component should be hidden', async(() => {
    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        const feeLogMainComp = fixture.debugElement.query(By.css('#feelog-main-component'));
        const feeDetailComp = fixture.debugElement.query(By.css('#feedetail-component'));
        expect(feeLogMainComp.nativeElement.hidden).toBeFalsy();
        expect(convertTxtToOneLine(feeLogMainComp.nativeElement.innerHTML)).toEqual(getFeelogMainHtml());
        expect(feeDetailComp.nativeElement.hidden).toBeTruthy();
      });
  }));

  it('clicking on edit fee main component should become hidden and detail comp should be visible', async(() => {
    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        const feeLogMainComp = fixture.debugElement.query(By.css('#feelog-main-component'));
        const editButton = fixture.debugElement.query(By.css('#fee-details button'));
        editButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const feeDetailComp = fixture.debugElement.query(By.css('#feedetail-component'));
        expect(feeLogMainComp.nativeElement.hidden).toBeTruthy();
        expect(feeDetailComp.nativeElement.hidden).toBeFalsy();
        expect(convertTxtToOneLine(feeDetailComp.nativeElement.innerHTML)).toEqual(getFeeLogDetailHtml());
      });
  }));

  it ('Edit feecasedetail but no changes were made', async(() => {
    const feelogServiceSpy = spyOn(feeLogServiceMock, 'addEditFeeToCase').and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;

    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        component.addEditFeeToCase(message);
        expect(feelogServiceSpy).toHaveBeenCalledTimes(0);
      });
  }));

  it ('Edit feecasedetail and call update', async(() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(feeLogServiceMock, 'addEditFeeToCase').and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;

    message.feeDetail.amount = 100;

    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        component.addEditFeeToCase(message).then(() => {
          expect(feelogServiceSpy).toHaveBeenCalledTimes(1);
          expect(feelogServiceSpy).toHaveBeenCalledWith('1', message.feeDetail, 'put');
        });
      });
  }));

  it('Add new case_fee_detail and call update', async(() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(feeLogServiceMock, 'addEditFeeToCase').and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = null;
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.case_fee_id = null;

    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        component.addEditFeeToCase(message).then(() => {
            expect(feelogServiceSpy).toHaveBeenCalledTimes(1);
            expect(feelogServiceSpy).toHaveBeenCalledWith('1', message.feeDetail, 'post');
          });
      });
  }));

  it('Edit already transferred to bar payment', async(() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(feeLogServiceMock, 'addEditFeeToCase').and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.amount = 100;

    const negatedFeeDetail = component.negateFeeDetail(message.originalFeeDetail);

    component.loadPaymentInstructionById(1);
    fixture.whenStable()
      .then(() => {
        component.model.status = PaymentStatus.TRANSFERREDTOBAR;
        fixture.detectChanges();
        component.addEditFeeToCase(message).then(() => {
            expect(feelogServiceSpy).toHaveBeenCalledTimes(2);
            expect(feelogServiceSpy).toHaveBeenCalledWith('1', negatedFeeDetail, 'post');
            expect(feelogServiceSpy).toHaveBeenCalledWith('1', message.feeDetail, 'post');
          });
      });
  }));

  it('negate case_fee_detail for restro spective editing', () => {
    const feeDetail = createPaymentInstruction().case_fee_details[0];
    const negatedFeeDetail = component.negateFeeDetail(feeDetail);
    expect(negatedFeeDetail.amount).toBe(feeDetail.amount ? feeDetail.amount * -1 : feeDetail.amount);
    expect(negatedFeeDetail.refund_amount).toBe(feeDetail.refund_amount ? feeDetail.refund_amount * -1 : feeDetail.refund_amount);
    expect(negatedFeeDetail.remission_amount)
      .toBe(feeDetail.remission_amount ? feeDetail.remission_amount * -1 : feeDetail.remission_amount);
    expect(negatedFeeDetail.fee_description).toEqual(feeDetail.fee_description);
    expect(negatedFeeDetail.case_fee_id).toBe(null);
  });

});
