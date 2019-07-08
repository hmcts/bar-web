import { FeelogMainComponent } from './feelog.main.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { createPaymentInstruction } from '../../../../test-utils/test-utils';
import {
  FeeDetailEventMessage,
  EditTypes
} from '../detail/feedetail.event.message';
import * as _ from 'lodash';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { FeelogServiceMock } from '../../../test-mocks/feelog.service.mock';
import { PaymentStatus } from '../../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../../models/paymentinstruction.model';
import { BarHttpClient } from '../../../../shared/services/httpclient/bar.http.client';
import { FeatureService } from '../../../../shared/services/feature/feature.service';
import { FeatureServiceMock } from '../../../test-mocks/feature.service.mock';
import { UserService } from '../../../../shared/services/user/user.service';
import { UserServiceMock } from '../../../test-mocks/user.service.mock';
import { PaymentStateService } from '../../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../../test-mocks/paymentstate.service.mock';
import { PaymentAction } from '../../../models/paymentaction.model';
import { FormsModule } from '@angular/forms';
import { IPaymentAction } from '../../../interfaces/payment-actions';
import { PaymentInstructionsService } from '../../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../../test-mocks/payment-instruction.service.mock';
import { FormatPound } from '../../../../shared/pipes/format-pound.pipe';


describe('Component: FeelogMainComponent', () => {
  let component: FeelogMainComponent;
  let fixture: ComponentFixture<FeelogMainComponent>;
  let rootEl: DebugElement;
  let paymentTableEl: DebugElement;
  let feeDetailTableEl: DebugElement;
  let actionSelectEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, HttpModule, HttpClientModule],
      declarations: [FeelogMainComponent, FormatPound],
      providers: [{ provide: PaymentStateService, useClass: PaymentstateServiceMock }]
    });

    TestBed.overrideComponent(FeelogMainComponent, {
      set: {
        providers: [
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: FeatureService, useClass: FeatureServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock }
        ]
      }
    });

    // create component and test fixture
    fixture = TestBed.createComponent(FeelogMainComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    rootEl = fixture.debugElement.query(By.css('div:first-of-type'));
    paymentTableEl = fixture.debugElement.query(By.css('#payment-instruction'));
    feeDetailTableEl = fixture.debugElement.query(By.css('#fee-details'));
    actionSelectEl = fixture.debugElement.query(By.css('#action'));
    component.model = new PaymentInstructionModel();
    component.model.payment_type = { id: 'CARD', name: 'Cards' };
    component.isVisible = true;
  });

  it('Should ensure this component has loaded successfully.', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('Setting component visibility', () => {
    component.isVisible = false;

    component.model = createPaymentInstruction();
    fixture.detectChanges();
    expect(rootEl.nativeElement.hidden).toBeTruthy();

    component.isVisible = true;
    fixture.detectChanges();
    expect(rootEl.nativeElement.hidden).toBeFalsy();
  });

  it('check if payment-instruction displayed correctly', async() => {
    component.model = createPaymentInstruction();
    const rows = paymentTableEl.nativeElement.querySelector('tr');
    const rowCells = paymentTableEl.nativeElement.children[1].children[0].cells;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(paymentTableEl.nativeElement.children.length).toBe(2);
    expect(rowCells.length).toBe(7);
    expect(rowCells[0].textContent.trim()).toBe('2');
    expect(rowCells[1].textContent.trim()).toBe('Jane Doe');
    expect(rowCells[2].textContent.trim()).toBe('Cheque');
    expect(rowCells[3].textContent.trim()).toBe('some_reference_id');
    expect(rowCells[4].textContent.trim()).toBe('£650.00');
  });

  it('if there is no fee attached to pi then the special section should be shwon', () => {
    const model = createPaymentInstruction();
    component.model = model;
    fixture.detectChanges();
    let pageText = rootEl.nativeElement.textContent;
    expect(pageText.includes('No fee details on payment')).toBeFalsy();

    model.case_fee_details = [];
    component.model = model;
    fixture.detectChanges();
    pageText = rootEl.nativeElement.textContent;
    expect(pageText.includes('No fee details on payment')).toBeTruthy();
  });

  it('check if feedetails displayed correctly if there is any fee', () => {
    expect(feeDetailTableEl).toBeFalsy();
    component.model = createPaymentInstruction();
    fixture.detectChanges();

    feeDetailTableEl = fixture.debugElement.query(By.css('#fee-details'));
    expect(feeDetailTableEl).toBeTruthy();
    const rows = feeDetailTableEl.nativeElement.children[1];
    expect(rows.children.length).toBe(2);
    expect(rows.children[0].cells[0].textContent.trim()).toBe('ccc111');
    expect(rows.children[0].cells[1].textContent.trim()).toBe(
      'Recovery of Land - High Court'
    );
    expect(rows.children[0].cells[2].textContent.trim()).toBe('£480.00');
    expect(rows.children[0].cells[4].textContent.trim()).toBe('£0.00');
    expect(rows.children[0].cells[5].textContent.trim()).toContain('Edit');
    expect(rows.children[0].cells[5].textContent.trim()).toContain('Remove');

    expect(rows.children[1].cells[0].textContent.trim()).toBe('ccc111');
    expect(rows.children[1].cells[1].textContent.trim()).toBe(
      'Special guardianship orders (section 14A(3) or (6)(a), 14C(3) or 14D(1))'
    );
    expect(rows.children[1].cells[2].textContent.trim()).toBe('£215.00');
    expect(rows.children[1].cells[4].textContent.trim()).toBe('£0.00');
    expect(rows.children[1].cells[5].textContent.trim()).toContain('Edit');
    expect(rows.children[1].cells[5].textContent.trim()).toContain('Remove');

    const remissionAmount = fixture.debugElement.queryAll(By.css('p.remission-amount-info'));
    expect(remissionAmount.length).toEqual(2);
    expect(remissionAmount[0].nativeElement.textContent.trim()).toBe('£30.00');
    expect(remissionAmount[1].nativeElement.textContent.trim()).toBe('£15.00');

    const remissionBenefiter = fixture.debugElement.queryAll(By.css('p.remission-benefiter-info'));
    expect(remissionBenefiter.length).toEqual(2);
    expect(remissionBenefiter[0].nativeElement.textContent.trim()).toBe('someone');
    expect(remissionBenefiter[1].nativeElement.textContent.trim()).toBe('someone');

    const remissionAuthorisation = fixture.debugElement.queryAll(By.css('p.remission-authorisation-info'));
    expect(remissionAuthorisation.length).toEqual(2);
    expect(remissionAuthorisation[0].nativeElement.textContent.trim()).toBe('auth123');
    expect(remissionAuthorisation[1].nativeElement.textContent.trim()).toBe('auth2');
  });

  it('Clicking on the edit button the the details page is loaded', () => {
    let message = new FeeDetailEventMessage();
    const model = createPaymentInstruction();
    component.onShowDetail.subscribe(value => (message = value));
    component.model = model;
    fixture.detectChanges();

    feeDetailTableEl = fixture.debugElement.query(By.css('#fee-details'));
    expect(feeDetailTableEl).toBeTruthy();
    const buttons = feeDetailTableEl.queryAll(By.css('button'));
    buttons[0].triggerEventHandler('click', null);
    expect(message.editType).toBe(EditTypes.UPDATE);
    expect(
      _.isEqual(message.feeDetail, model.case_fee_details[0])
    ).toBeTruthy();

    buttons[1].triggerEventHandler('click', null);
    expect(message.editType).toBe(EditTypes.UPDATE);
    expect(
      _.isEqual(message.feeDetail, model.case_fee_details[1])
    ).toBeTruthy();
  });

  xit('clicking add fee button loads the details page with the correct settings', () => {
    let message = new FeeDetailEventMessage();
    const model = createPaymentInstruction();
    component.onShowDetail.subscribe(value => (message = value));
    component.model = model;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const addFeeBtn = buttons.find(
      it => it.nativeElement.textContent === 'Add case and fee details'
    );

    addFeeBtn.triggerEventHandler('click', null);
    expect(message.editType).toBe(EditTypes.CREATE);
    expect(_.isEqual(message.feeDetail, new FeeDetailModel())).toBeTruthy();
  });

  it('clicking to remove link then the remove service is called and reload is requested', done => {
    let sentModelId: number;
    const model = createPaymentInstruction();
    component.onReloadModel.subscribe(value => {
      sentModelId = value;
      expect(_.isEqual(sentModelId, model.id)).toBeTruthy();
      done();
    });
    component.model = model;
    fixture.detectChanges();

    const removeLinks = fixture.debugElement
      .queryAll(By.css('a'))
      .filter(it => it.nativeElement.textContent === 'Remove');
    removeLinks[0].triggerEventHandler('click', null);
  });

  it('submit process fails to call out as no action is set', () => {
    let paymentInstruction: PaymentInstructionModel;
    const model = createPaymentInstruction();
    component.model = model;
    component.onProcess.subscribe(async (value) => {
      paymentInstruction = value;
      await fixture.whenStable();
      component.submitAction();
      fixture.detectChanges();
      expect(paymentInstruction).toBe(undefined);
      const actionDiv = fixture.debugElement.query(By.css('.action-form'));
      expect(actionDiv.nativeElement.className).toContain('form-group-error');
    });
  });

  it('submit process calls out for processing the pi', () => {
    let paymentInstruction: PaymentInstructionModel;
    const model = createPaymentInstruction();
    component.model = model;
    component.onProcess.subscribe(value => {
      paymentInstruction = value;
      component.selectedAction.action = PaymentAction.PROCESS;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#submit-action-btn'));
      button.triggerEventHandler('click', null);
      expect(paymentInstruction).toBe(model);
    });
  });

  it('submit return calls out for returning the pi', () => {
    let onReturnIsCalled = false;
    const model = createPaymentInstruction();
    component.model = model;
    component.onReturn.subscribe(value => {
      onReturnIsCalled = true;
      component.selectedAction.action = PaymentAction.RETURNS;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#submit-action-btn'));
      button.triggerEventHandler('click', null);
      expect(onReturnIsCalled).toBeTruthy();
    });
  });

  it('suspense calls out for suspensing the pi', () => {
    let onSuspenseIsCalled = false;
    const model = createPaymentInstruction();
    component.model = model;
    component.onSuspense.subscribe(value => {
      onSuspenseIsCalled = true;
      component.selectedAction.action = PaymentAction.SUSPENSE;
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#submit-action-btn'));
      button.triggerEventHandler('click', null);
      expect(onSuspenseIsCalled).toBeTruthy();
    });
  });

  it('Should return false if payment status is not "Pending", "Validated", or "Rejected"', () => {
    const paymentStatus = PaymentStatus.PENDINGAPPROVAL;
    expect(component.checkIfValidForReturn(paymentStatus)).toBeFalsy();
  });

  it('Should ensure that false is returned since PaymentInstructionModel status is not set to TTB', () => {
    component.model = createPaymentInstruction();
    fixture.detectChanges();
    expect(component.checkIfRefundExists()).toBeFalsy();
  });

  it('should return that refund exists when pi status is TTB and there is a refund', () => {
    const model = createPaymentInstruction();
    model.status = PaymentStatus.TRANSFERREDTOBAR;
    model.case_fee_details[0].refund_amount = 10;
    component.model = model;
    fixture.detectChanges();

    expect(component.checkIfRefundExists()).toBeTruthy();
  });

  it('should change the action correctly', () => {
    const actionName = { action: 'Withdraw', disabled: false };
    component.onChangeAction(actionName);
    expect(component.selectedAction.action).toEqual('Withdraw');
  });

  it('should set showWithdrawTextarea to true.', () => {
    component.onToggleReason('3');
    expect(component.showWithdrawTextArea).toBeTruthy();
  });

  it('should set showWithdrawTextarea to false.', () => {
    component.onToggleReason('1');
    expect(component.showWithdrawTextArea).toBeFalsy();
  });

  it('should call "onSuspenseDeficiency"', () => {
    spyOn(component.onSuspenseDeficiency, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.SUSPENSEDEFICIENCY };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onSuspenseDeficiency.emit).toHaveBeenCalled();
  });

  it('should call "onProcessPayment"', () => {
    spyOn(component.onProcess, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.PROCESS };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onProcess.emit).toHaveBeenCalled();
  });

  it('should call "onReturnPayment"', () => {
    spyOn(component.onReturn, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.RETURNS };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onReturn.emit).toHaveBeenCalled();
  });

  it('should call "onSuspensePayment"', () => {
    spyOn(component.onSuspense, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.SUSPENSE };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onSuspense.emit).toHaveBeenCalled();
  });

  it('should call "onWithdrawPayment"', () => {
    spyOn(component.onWithDraw, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.WITHDRAW };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onWithDraw.emit).toHaveBeenCalled();
  });

   it('should check option withdraw validation', () => {
      const model = createPaymentInstruction(),
       paymentAction: IPaymentAction = { action: PaymentAction.WITHDRAW };
      component.selectedAction = paymentAction;
      component.model = model;
      component.model.action_reason = '3';
      component.submitAction();
      expect(component.submitActionWithdrawError).toBe('Enter comments');

      component.model.action_comment = 'QW';
      component.submitAction();
      expect(component.submitActionWithdrawError).toBe('Comment must be at least 3 characters');
  });

  it('should call "onRevertPaymentInstruction"', () => {
    spyOn(component.onPaymentReversion, 'emit');
    spyOn(component, 'checkIfReadOnly');
    component.revertPaymentInstruction();
    expect(component.onPaymentReversion.emit).toHaveBeenCalled();
  });

  it('should call "onRefund"', () => {
    spyOn(component.onRefund, 'emit');
    const paymentAction: IPaymentAction = { action: PaymentAction.REFUNDED };
    component.selectedAction = paymentAction;
    component.submitAction();
    expect(component.onRefund.emit).toHaveBeenCalled();
  });

  it('should return the right "ReturnReason"', () => {
    const reason = component.getReturnReason(1);
    expect(reason).toBe('Overpayment');
  });

  it('should return the right "WithdrawReason"', () => {
    const reason = component.getWithdrawReason(3);
    expect(reason).toBe('Other (add comment)');
  });
});
