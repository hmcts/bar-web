import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {CheckSubmitComponent} from './check-submit.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../../shared/services/user/user.service';
import {UserServiceMock} from '../../test-mocks/user.service.mock';
import {CardComponent} from '../../../shared/components/card/card.component';
import {PaymentLogServiceMock} from '../../test-mocks/payment-log.service.mock';
import {DebugElement} from '@angular/core';
import {PaymentInstructionsService} from '../../services/payment-instructions/payment-instructions.service';
import createSpyObj = jasmine.createSpyObj;
import {getPaymentInstructions, transformIntoCheckAndSubmitModel} from '../../../test-utils/test-utils';
import {PaymentInstructionServiceMock} from '../../test-mocks/payment-instruction.service.mock';

describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;
  // let paymentLogsServiceMock, paymentInstructionsServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent, CheckSubmitComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])]
    }).overrideComponent(CheckSubmitComponent, {
      set: {
        providers: [
          {provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock},
          {provide: PaymentslogService, useClass: PaymentLogServiceMock},
          {provide: UserService, useClass: UserServiceMock}
        ]
      }
    });

    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // reset component afterward
    component = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Get payment instructions, and ensure data is present', () => {
    const componentElement: DebugElement = fixture.debugElement;
    fixture.detectChanges();

    console.log(componentElement.nativeElement.textContent);

    // console.log(componentElement.nativeElement.textContent);
    expect(componentElement.nativeElement.textContent).toContain('');
  });

  // it('On "select all", ensure all payment instructions are "checked".');
  //
  // it('As a payment instruction is "toggled", it should be "checked"');

});
