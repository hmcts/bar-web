import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLinkWithHref, RouterModule} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RouterTestingModule} from '@angular/router/testing';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../test-mocks/paymentsoverview.service.mock';
import { OverviewData } from '../../models/overviewdata.model';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-delivery-manager', 'bar-fee-clerk']
});

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentOverviewComponent ],
      providers: [
        UserService,
        CookieService
      ]
    }).overrideComponent(PaymentOverviewComponent, {
      set: {
        providers: [
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should show the right number of validated payments', () => {
    const validatedCount = component.count.validated;
  });

  it('arrangeOverviewComponent', () => {
    const results = {};
    results['bar-post-clerk'] = { key : [{
      bar_user_full_name: 'Post Clerk',
      bar_user_id: 1,
      bar_user_role: 'bar-post-clerk'
    }]};
    results['bar-fee-clerk'] = { key: [{
      bar_user_full_name: 'Fee Clerk',
      bar_user_id: 2,
      bar_user_role: 'bar-fee-clerk'
    }]};
    component.arrangeOverviewComponent(results);
    expect(component.feeClerks.length).toBe(1);
  });

  it ('test overview data creation', () => {
    const overview = new OverviewData();
    overview.assign({
      bar_user_full_name: 'Bar User',
      bar_user_id: '1',
      bar_user_role: 'bar-fee-clerk'
    });
    expect(overview.userFullName).toBe('Bar User');
    expect(overview.userId).toBe('1');
    expect(overview.userRole).toBe('bar-fee-clerk');
  });
});
