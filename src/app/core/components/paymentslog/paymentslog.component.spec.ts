import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentslogComponent } from './paymentslog.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';

import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';

describe('PaymentslogComponent', () => {
  let component: PaymentslogComponent;
  let fixture: ComponentFixture<PaymentslogComponent>;

  class MockRouter {
    get url() {
      return '/change-payment';
    }
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ CardComponent, PaymentslogComponent, UpperCaseFirstPipe, NumbersOnlyDirective ],
    }).overrideComponent(PaymentslogComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('hasSelectedFields', () => {
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     expect(component.payments_logs.length).toBe(1);
  //     expect(component.hasSelectedFields()).toBeFalsy();
  //     component.onSelectAllPosts();
  //     expect(component.hasSelectedFields()).toBeTruthy();
  //   });
  // });

  // it('countNumberOfPosts', () => {
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     expect(component.payments_logs.length).toBe(1);
  //     expect(component.countNumberOfPosts()).toBe(0);
  //     component.onSelectAllPosts();
  //     expect(component.countNumberOfPosts()).toBe(1);
  //   });
  // });
});
