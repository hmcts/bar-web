import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FeelogeditComponent } from './feelogedit.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user/user.service';
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { FormatPound } from '../../../shared/pipes/format-pound.pipe';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { CookieService } from 'ngx-cookie-service';
import { FeelogService } from '../../services/feelog/feelog.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { ModalComponent } from '../modal/modal.component';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// include mocks
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { FeelogServiceMock } from '../../test-mocks/feelog.service.mock';
import { FeelogMainComponent } from './main/feelog.main.component';
import { FeeDetailComponent } from './detail/feedetail.component';
import {
  createPaymentInstruction,
  convertTxtToOneLine,
  getFeeLogDetailHtml,
  getPaymentInstructionById,
  getPaymentInstructionDataRaw
} from '../../../test-utils/test-utils';
import {
  UnallocatedAmountEventMessage,
  FeeDetailEventMessage,
  EditTypes
} from './detail/feedetail.event.message';
import { By } from '@angular/platform-browser';
import { PaymentAction } from '../../models/paymentaction.model';
import { PaymentInstructionActionModel } from '../../models/payment-instruction-action.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { BarHttpClientMock } from '../../test-mocks/bar.http.client.mock';
import { FeatureService } from '../../../shared/services/feature/feature.service';
import { FeatureServiceMock } from '../../test-mocks/feature.service.mock';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { PaymentActionServiceMock } from '../../test-mocks/payment-action.service.mock';
import { PaymentActionService } from '../../../shared/services/action/paymentaction.service';
import { Location } from '@angular/common';
import { ConstantPool } from '@angular/compiler';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';

let feeLogServiceMock: any;
let paymentLogServiceMock;
let paymentActionServiceMock;
let location: any;
let mockRouter;
let route;


describe('FeelogeditComponent', () => {
  let component: FeelogeditComponent;
  let fixture: ComponentFixture<FeelogeditComponent>;


  class MockRouter {
    get url() {
      return '/change-payment';
    }

    get events() {
      return of({});
    }

    createUrlTree() {
      return of({});
    }

    navigateByUrl(url: string): string {
      return url;
    }

    serializeUrl(urlTree) {
      return '';
    }
  }

  const mockActivatedRoute = {
    data: new BehaviorSubject<any>(getPaymentInstructionDataRaw())
  };

  beforeEach(() => {
    mockRouter = new MockRouter();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule.withRoutes([
          { path: 'feelog', redirectTo: ''}
        ])
      ],
      declarations: [
        FeelogeditComponent,
        HmctsModalComponent,
        FormatPound,
        ModalComponent,
        FeelogMainComponent,
        FeeDetailComponent
      ],
      providers: [
        CookieService,
        { provide: PaymentStateService, useClass: PaymentstateServiceMock },
        { provide: BarHttpClient, useClass: BarHttpClientMock }
      ]
    }).overrideComponent(FeelogeditComponent, {
      set: {
        providers: [
          CookieService,
          { provide: Router, useClass: MockRouter },
          { provide: PaymentStateService, useClass: PaymentstateServiceMock },
          { provide: BarHttpClient, useClass: BarHttpClientMock },
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymentActionService, useClass: PaymentActionServiceMock },
          { provide: FeatureService, useClass: FeatureServiceMock },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: UserService, useClass: UserServiceMock},
          Location,
        ]
      }
    });

    TestBed.overrideComponent(FeelogMainComponent, {
      set: {
        providers: [
          CookieService,
          { provide: UserService, useClass: UserServiceMock},
          { provide: FeatureService, useClass: FeatureServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(FeelogeditComponent);
    component = fixture.componentInstance;
    feeLogServiceMock = fixture.debugElement.injector.get(FeelogService);
    paymentLogServiceMock = fixture.debugElement.injector.get(PaymentslogService);
    paymentActionServiceMock = fixture.debugElement.injector.get(PaymentActionService);
    location = fixture.debugElement.injector.get(Location);
    route = fixture.debugElement.injector.get(ActivatedRoute);
    spyOn(route, 'data').and.callThrough();
    spyOn(component, 'loadFeeJurisdictions').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('test hash handling during init', async() => {
    let param = null;
    spyOn(component, 'makeDetailsVisible').and.callFake((event) => {
      param = event;
    });
    window.location.hash = 'fees';
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(param.editType).toEqual(EditTypes.CREATE);
  });

  it('load payment instruction with unallocated amount', async() => {
    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.model).toEqual(createPaymentInstruction());
  });

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

  it('clicking on edit fee main component should become hidden and detail comp should be visible', async() => {
    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.feeDetailsComponentOn).toBeFalsy();
  });

  it('Edit feecasedetail but no changes were made', async() => {
    const feelogServiceSpy = spyOn(
      feeLogServiceMock,
      'addEditFeeToCase'
    ).and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;

    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    fixture.detectChanges();
    component.addEditFeeToCase(message);
    expect(feelogServiceSpy).toHaveBeenCalledTimes(0);
  });

  it('Edit feecasedetail and call update', async() => {
    component.model.id = 1;
    const feelogServiceSpy = spyOn(feeLogServiceMock, 'addEditFeeToCase').and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.amount = 100;
    component.loadPaymentInstructionById(3);
    await fixture.whenStable();
    fixture.detectChanges();
    await component.addEditFeeToCase(message);
    expect(feelogServiceSpy).toHaveBeenCalledTimes(1);
    expect(feelogServiceSpy).toHaveBeenCalledWith('3', message.feeDetail, 'put');
  });

  it('Add new case_fee_detail and call update', async() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(
      feeLogServiceMock,
      'addEditFeeToCase'
    ).and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = null;
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.case_fee_id = null;

    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    fixture.detectChanges();
    await component.addEditFeeToCase(message);
    expect(feelogServiceSpy).toHaveBeenCalledTimes(1);
    expect(feelogServiceSpy).toHaveBeenCalledWith(
      '3',
      message.feeDetail,
      'post'
    );
  });

  it('Edit already transferred to bar payment', async() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(
      feeLogServiceMock,
      'addEditFeeToCase'
    ).and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.amount = 100;

    const negatedFeeDetail = component.negateFeeDetail(
      message.originalFeeDetail
    );
    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    component.model.status = PaymentStatus.TRANSFERREDTOBAR;
    fixture.detectChanges();
    await component.addEditFeeToCase(message);
    expect(feelogServiceSpy).toHaveBeenCalledTimes(2);
    expect(feelogServiceSpy).toHaveBeenCalledWith('3', negatedFeeDetail, 'post');
  });

  it('Throw remission amount is bigger error', async() => {
    component.loadedId = '1';
    const feelogServiceSpy = spyOn(
      feeLogServiceMock,
      'addEditFeeToCase'
    ).and.callThrough();
    const message = new FeeDetailEventMessage();
    message.originalFeeDetail = createPaymentInstruction().case_fee_details[0];
    message.feeDetail = createPaymentInstruction().case_fee_details[0];
    message.editType = EditTypes.UPDATE;
    message.feeDetail.amount = 100;

    const negatedFeeDetail = component.negateFeeDetail(
      message.originalFeeDetail
    );
    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    component.model.status = PaymentStatus.TRANSFERREDTOBAR;
    message.feeDetail.remission_amount = 200;
    fixture.detectChanges();
    // await component.addEditFeeToCase(message);
    expect(function() {
      component.addEditFeeToCase(message);
    }).toThrow();
  });

  it('negate case_fee_detail for restro spective editing', () => {
    const feeDetail = createPaymentInstruction().case_fee_details[0];
    const negatedFeeDetail = component.negateFeeDetail(feeDetail);
    expect(negatedFeeDetail.amount).toBe(
      feeDetail.amount ? feeDetail.amount * -1 : feeDetail.amount
    );
    expect(negatedFeeDetail.refund_amount).toBe(
      feeDetail.refund_amount
        ? feeDetail.refund_amount * -1
        : feeDetail.refund_amount
    );
    expect(negatedFeeDetail.remission_amount).toBe(
      feeDetail.remission_amount
        ? feeDetail.remission_amount * -1
        : feeDetail.remission_amount
    );
    expect(negatedFeeDetail.fee_description).toEqual(feeDetail.fee_description);
    expect(negatedFeeDetail.case_fee_id).toBe(null);
  });

  it('should set "suspenseModalOn" to "true"', () => {
    component.onSuspensePayment();
    expect(component.suspenseModalOn).toBeTruthy();
  });

  it('should "closeDetails"', () => {
    component.closeDetails();
    expect(component.mainComponentOn).toBeTruthy();
    expect(component.feeDetailsComponentOn).toBeFalsy();
  });

  it('should process payment', async() => {
    const paymentInstructionActionModel = new PaymentInstructionActionModel();
    const model = createPaymentInstruction();
    component.onProcessPaymentSubmission(model);
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.PROCESS);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.SUSPENSE);
  });

  it('should process suspense payment', async() => {
    component.model = getPaymentInstructionById(1);
    const paymentInstructionActionModel = new PaymentInstructionActionModel();
    const mockEvent = {
      preventDefault() {
        console.log('preventDefault() triggered...');
      }
    };
    component.onSuspenseFormSubmit(mockEvent);
    component.paymentInstructionActionModel.action_reason = 'something';

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.SUSPENSE);
    expect(component.suspenseModalOn).toBeFalsy();
  });

  it('should toggle successfully', () => {
    component.model = getPaymentInstructionById(1);
    component.refundModalOn = true;
    component.toggleRefundModal();

    component.suspenseModalOn = true;
    component.toggleSuspenseModal();

    expect(component.refundModalOn).toBeFalsy();
    expect(component.suspenseModalOn).toBeFalsy();
  });

  it('should change status to refund...', async() => {
    component.model = getPaymentInstructionById(1);
    component.changeStatusToRefund();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.model.action).toBe(PaymentAction.REFUNDED);
    expect(component.model.status).toBe(PaymentStatus.VALIDATED);
  });

  it('should return payment to postclerk...', async() => {
    spyOn(mockRouter, 'navigateByUrl');
    component.model = getPaymentInstructionById(1);
    component.model.action_comment = 'Hello World';
    component.returnPaymentToPostClerk();
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.RETURNS);
    expect(component.paymentInstructionActionModel.action_reason).toBe(component.model.action_reason);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should change payment to validated...', async() => {
    component.model = getPaymentInstructionById(1);
    component.onProcessPaymentSubmission(component.model);
    await fixture.whenStable();

    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.SUSPENSE);
    expect(component.paymentInstructionActionModel.status).toBe(PaymentStatus.VALIDATED);
  });

  it('should get correct unallocated_amount', async() => {
    component.loadPaymentInstructionById(1);
    await fixture.whenStable();
    expect(component.model.unallocated_amount).toBe(0);
  });

  it('should send a payment with withdraw', async() => {
    const sendPaymentInstructionActionSpy = spyOn(feeLogServiceMock, 'sendPaymentInstructionAction').and.callThrough();
    await fixture.whenStable();

    const paymentInstruction = createPaymentInstruction();
    const paymentInstructionAction = new PaymentInstructionActionModel();
    paymentInstructionAction.action = PaymentAction.WITHDRAW;
    paymentInstructionAction.action_comment = 'Hello World.';
    component.model = paymentInstruction;
    component.model.action_reason = 'Hello World.';
    component.paymentInstructionActionModel = paymentInstructionAction;
    component.onWithdrawPaymentSubmission();
    expect(sendPaymentInstructionActionSpy).toHaveBeenCalledWith(paymentInstruction, paymentInstructionAction);
  });

  it('should send a payment with withdraw and action comment', async() => {
    const sendPaymentInstructionActionSpy = spyOn(feeLogServiceMock, 'sendPaymentInstructionAction').and.callThrough();
    await fixture.whenStable();

    const paymentInstruction = createPaymentInstruction();
    const paymentInstructionAction = new PaymentInstructionActionModel();
    paymentInstructionAction.action = PaymentAction.WITHDRAW;
    paymentInstructionAction.action_comment = 'Hello World.';
    component.model = paymentInstruction;
    component.model.action_reason = 'Hello World.';
    component.model.action_comment = 'Hello World2.';
    component.paymentInstructionActionModel = paymentInstructionAction;
    component.onWithdrawPaymentSubmission();
    expect(sendPaymentInstructionActionSpy).toHaveBeenCalledWith(paymentInstruction, paymentInstructionAction);
  });

  it('test hadle jusrisdiction load failure', () => {
    spyOn(feeLogServiceMock, 'getFeeJurisdictions').and.throwError('failed to load jurisdictions');
    component.ngOnInit();
    expect(component.jurisdictions).toEqual(component.createEmptyJurisdiction());
  });

  it('show error when submit was unsuccesful', async() => {
    spyOn(feeLogServiceMock, 'sendPaymentInstructionAction')
      .and
      .returnValue(Promise.reject({ error: { message: 'failed to submit action' } }));
    component.model = getPaymentInstructionById(1);
    component.onProcessPaymentSubmission(component.model);
    await fixture.whenStable();

    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.PROCESS);
    expect(component.paymentInstructionActionModel.status).toBe(PaymentStatus.VALIDATED);
    expect(component.submitActionError).toBe('failed to submit action');
  });

  it('show error when withdraw was unsuccesful', async() => {
    spyOn(feeLogServiceMock, 'sendPaymentInstructionAction').and
      .returnValue(Promise.reject({ error: {message : 'failed to submit withdraw'}}));
    component.model = getPaymentInstructionById(1);
    component.onWithdrawPaymentSubmission();
    await fixture.whenStable();

    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.WITHDRAW);
    expect(component.paymentInstructionActionModel.status).toBe(PaymentStatus.VALIDATED);
    expect(component.submitActionError).toBe('failed to submit withdraw');
  });

  it('show error when return was unsuccesful', async() => {
    spyOn(feeLogServiceMock, 'sendPaymentInstructionAction').and
      .returnValue(Promise.reject({ error: {message : 'failed to submit return'}}));
    component.model = getPaymentInstructionById(1);
    component.returnPaymentToPostClerk();
    await fixture.whenStable();

    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.RETURNS);
    expect(component.paymentInstructionActionModel.status).toBe(PaymentStatus.VALIDATED);
    expect(component.submitActionError).toBe('failed to submit return');
  });

  it('show refund was succesful', async() => {
    const sendPaymentInstructionActionSpy = spyOn(feeLogServiceMock, 'sendPaymentInstructionAction').and.callThrough();
    const paymentInstruction = createPaymentInstruction();
    const paymentInstructionAction = new PaymentInstructionActionModel();
    paymentInstructionAction.action = PaymentAction.REFUNDED;
    paymentInstructionAction.action_comment = 'Hello World.';
    component.model = paymentInstruction;
    component.model.action_reason = 'Hello World.';
    component.paymentInstructionActionModel = paymentInstructionAction;
    component.onRefund();
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.REFUNDED);
    expect(sendPaymentInstructionActionSpy).toHaveBeenCalledWith(paymentInstruction, paymentInstructionAction);
  });

  it('should allow "suspenseFormatSubmit()"', async() => {
    component.paymentInstructionActionModel.action_reason = '1';
    component.paymentInstructionActionModel.action_comment = 'Random reason...?';
    component.suspenseModalOn = true;
    const e = { preventDefault() { } };
    spyOn(e, 'preventDefault');

    component.onSuspenseFormSubmit(e);
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.SUSPENSE);

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.paymentInstructionActionModel.action).toBe(PaymentAction.SUSPENSE);
    expect(component.suspenseModalOn).toBeFalsy();
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('should go back', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should turn mainComponentOn "on".', () => {
    component.goBack();
    expect(component.mainComponentOn).toBeTruthy();
  });

  it('filters available actions based on payment type', async() => {
    const paymentInstruction = createPaymentInstruction();
    const actions = [{ action: 'Process' }, { action: 'Return' }, { action: 'Withdraw' }, { action: 'Refund' }, { action: 'Suspense' }];
    let filtered = component.filterActionsBasedType(paymentInstruction.payment_type, actions);
    expect(filtered.length).toBe(5);
    paymentInstruction.payment_type = { id: 'FULL_REMISSION', name: 'Full Remission' };
    filtered = component.filterActionsBasedType(paymentInstruction.payment_type, actions);
    expect(filtered.length).toBe(3);
  });

});
