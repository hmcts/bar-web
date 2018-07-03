import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLinkWithHref, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../test-mocks/paymentsoverview.service.mock';
import { OverviewData } from '../../models/overviewdata.model';
import { UserRole } from '../../models/userrole.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { UserServiceMock } from '../../test-mocks/user.service.mock';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-delivery-manager', 'bar-fee-clerk'],
});

const clerkData = `{
  "365751": [
    {
      "bar_user_id": "365751",
      "bar_user_full_name": "Karen Taylor",
      "count_of_payment_instruction_in_specified_status": 1,
      "sr_fee_clerk": false
    }
  ],
  "365752": [
    {
      "bar_user_id": "365752",
      "bar_user_full_name": "James Black",
      "count_of_payment_instruction_in_specified_status": 2,
      "sr_fee_clerk": true
    }
  ],
  "365756": [
    {
      "bar_user_id": "365756",
      "bar_user_full_name": "James2 Black2",
      "count_of_payment_instruction_in_specified_status": 1,
      "sr_fee_clerk": true
    }
  ]
}`;

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentOverviewComponent ],
      providers: [
        UserService,
        CookieService,
        BarHttpClient
      ]
    }).overrideComponent(PaymentOverviewComponent, {
      set: {
        providers: [
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock }
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

  it('should return the correct user.', () => {
    expect(component.user).toBe(USER_OBJECT);
  });

  it('should change the correct "userRole" and "status".', () => {
    component.setStatusAndUserRoleForPaymentOverviewQuery();
    expect(component.userRole).toBe(UserRole.SRFEECLERK);
    expect(component.status).toBe(PaymentStatus.APPROVED);
  });

  it('should populate the fee clerk array', () => {
    component.status = 'PA';
    component.feeClerks = [];
    component.createFeeClerksOverview(JSON.parse(clerkData));
    expect(component.feeClerks.length).toBeGreaterThan(0);
    expect(component.feeClerks[0].piLink).toBe('/users/365751/payment-instructions/PA');
    expect(component.feeClerks[1].piLink).toBe('#');
    expect(component.feeClerks[2].piLink).toBe('#');
    expect(component.feeClerks[0].readyToReview).toBe(1);
    expect(component.feeClerks[1].readyToReview).toBe(2);
    expect(component.feeClerks[2].readyToReview).toBe(1);
  });

  it('should populate the sr fee clerk array', () => {
    component.status = 'A';
    component.seniorFeeClerks = [];
    component.createSeniorFeeClerksOverview(JSON.parse(clerkData));
    expect(component.seniorFeeClerks.length).toBeGreaterThan(0);
    expect(component.seniorFeeClerks[0].readyToTransferToBar).toBe(1);
    expect(component.seniorFeeClerks[1].readyToTransferToBar).toBe(2);
    expect(component.seniorFeeClerks[2].readyToTransferToBar).toBe(1);
  });

  // @TODO: Need to complete this test
  // it('should give the right number of seniorfeeclerk data "length".', () => {
  //   const mockData = [];
  //   component.createSeniorFeeClerksOverview(mockData);
  //   expect(component.seniorFeeClerks.length).toBe(9);
  // });
});
