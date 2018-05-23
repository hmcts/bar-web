import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentInstructionComponent } from './payment-instruction.component';
import { ModalComponent } from './../modal/modal.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { UserService } from '../../../shared/services/user/user.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { CookieService } from 'ngx-cookie-service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';

describe('DashboardComponent', () => {
  let component: PaymentInstructionComponent;
  let fixture: ComponentFixture<PaymentInstructionComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  class MockRouter {
    get url() {
      return '/change-payment';
    }
    navigateByUrl(url: string) { return url; }
  }

  class MockActivatedRoute {

    get params() {
      return new Observable(observer => {
        observer.next({id: '2'}),
        observer.complete();
      });
    }
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentInstructionComponent, ModalComponent, NumbersOnlyDirective ]
    }).overrideComponent(PaymentInstructionComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentInstructionComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.paymentTypes.length).toBe(5);
    });
  }));

  it('load payment data by id', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.loadedId).toBe('2');
      expect(component.model.id).toBe(3);
    });
  });

  it('on submit', async(() => {
    let navigateUrl = '';
    spyOn(router, 'navigateByUrl').and.callFake(param => {
      navigateUrl = param;
    });
    component.model.cheque_number = '12345';
    component.onFormSubmission();
    fixture.whenStable().then(() => {
      expect(component.model.cheque_number).toBe('');
      expect(navigateUrl).toBe('/feelog/edit/3');
    });
  }));

});
