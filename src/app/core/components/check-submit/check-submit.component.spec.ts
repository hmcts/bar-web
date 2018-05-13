import {async, ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CheckSubmitComponent } from './check-submit.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../../../shared/services/util/util.service';
import {UserService} from '../../../shared/services/user/user.service';
import {UserServiceMock} from '../../test-mocks/user.service.mock';
import {CardComponent} from '../../../shared/components/card/card.component';
import {PaymentLogServiceMock} from '../../test-mocks/payment-log.service.mock';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {DebugElement} from '@angular/core';

describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;
  let debugEl;
  let nativeEl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent, CheckSubmitComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      providers: [
        UtilService,
        { provide: PaymentslogService, useValue: PaymentLogServiceMock },
        { provide: UserService, useClass: UserServiceMock },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    debugEl  = fixture.debugElement;
    nativeEl = debugEl.nativeElement;
  });

  afterEach(() => {
    // reset component afterward
    component = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Get payment instructions, and ensure data is present', async() => {
    component.getPaymentInstructions();
    component.name = 'James';
    const componentElement: DebugElement = fixture.debugElement;

    // console.log( component.checkAndSubmitModels );
    // console.log( content );
    expect(componentElement.nativeElement.textContent).toContain(component.name);
  });

  it('On "select all", ensure all payment instructions are "checked".');

  it('As a payment instruction is "toggled", it should be "checked"');

});
