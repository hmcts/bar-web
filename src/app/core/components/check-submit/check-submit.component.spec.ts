import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import {CheckSubmitComponent} from './check-submit.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../../../shared/services/util/util.service';
import { UserService } from '../../../shared/services/user/user.service';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { By } from '@angular/platform-browser';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';


describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;
  // let paymentLogsServiceMock, paymentInstructionsServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckSubmitComponent, CardComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])]
    });

    TestBed.overrideComponent(CheckSubmitComponent, {
      set: {
        providers: [
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock }
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
    expect(componentElement.nativeElement.textContent).toContain('');
  });

  // it('component is created and payment instruction are shown', async(() => {
  //   fixture.whenStable()
  //   .then(() => {
  //     fixture.detectChanges();
  //     const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
  //     expect(component.casModels.length).toBe(2);
  //   });
  // }));

  // it('expect the date is shown correctly', async(() => {
  //   fixture.whenStable()
  //   .then(() => {
  //     fixture.detectChanges();
  //     const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
  //     expect(checkAndSubmitTable.nativeElement.innerText).toContain('9/May/2018');
  //   });
  // }));

  // it('expect there is no hyphen in the table', async(() => {
  //   fixture.whenStable()
  //   .then(() => {
  //     fixture.detectChanges();
  //     const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
  //     expect(checkAndSubmitTable.nativeElement.innerText.includes('-')).toBeFalsy();
  //   });
  // }));
});
