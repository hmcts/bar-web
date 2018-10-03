import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-delivery-manager', 'bar-fee-clerk'],
});

const SR_FEE_CLERK_USER_OBJECT: UserModel = new UserModel({
  id: 365753,
  courtId: 'BR04',
  email: 'sr.feeclerk@hmcts.net',
  forename: 'Senior',
  surname: 'Feeclerk',
  password: 'password',
  roles: ['bar-senior-feeclerk', 'bar-fee-clerk'],
});

const clerkData = `{
  "365751": [
    {
      "bar_user_id": "365751",
      "bar_user_full_name": "Karen Taylor",
      "count_of_payment_instruction_in_specified_status": 1,
      "list_of_payment_instructions": [1,2,3]
    }
  ],
  "365752": [
    {
      "bar_user_id": "365752",
      "bar_user_full_name": "James Black",
      "count_of_payment_instruction_in_specified_status": 2,
      "list_of_payment_instructions": [1,2,3]
    }
  ],
  "365756": [
    {
      "bar_user_id": "365756",
      "bar_user_full_name": "James2 Black2",
      "count_of_payment_instruction_in_specified_status": 1,
      "list_of_payment_instructions": [1,2,3]
    }
  ]
}`;

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;
  let barHttpClient: BarHttpClient;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]),
                FormsModule ],
      declarations: [ PaymentOverviewComponent, HmctsModalComponent, CardComponent ],
      providers: [
        UserService,
        CookieService,
        BarHttpClient,
        PaymentsOverviewServiceMock
      ]
    }).overrideComponent(PaymentOverviewComponent, {
      set: {
        providers: [
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    }).compileComponents();
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    barHttpClient = fixture.debugElement.injector.get(BarHttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    expect(component).toBeTruthy();
  });

  it('Should show the right number of validated payments', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    const validatedCount = component.count.validated;
  });

  it('arrangeOverviewComponent', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
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
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
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
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    expect(component.user).toBe(USER_OBJECT);
  });

  it('should change the correct "userRole" and "status".', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    component.setStatusAndUserRoleForPaymentOverviewQuery();
    expect(component.userRole).toBe(UserRole.srFeeClerkUser.name);
    expect(component.status).toBe(PaymentStatus.APPROVED);
  });

  it('should populate the fee clerk array', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    component.status = 'PA';
    component.feeClerks = [];
    component.createFeeClerksOverview(JSON.parse(clerkData));
    expect(component.feeClerks.length).toBeGreaterThan(0);
    expect(component.feeClerks[0].piLink).toBe('/users/365751/payment-instructions/stats');
    expect(component.feeClerks[0].queryParams).toEqual({status: 'PA', fullName: 'Karen Taylor'});
    expect(component.feeClerks[1].piLink).toBe('/users/365752/payment-instructions/stats');
    expect(component.feeClerks[1].queryParams).toEqual({status: 'PA', fullName: 'James Black'});
    expect(component.feeClerks[2].piLink).toBe('/users/365756/payment-instructions/stats');
    expect(component.feeClerks[2].queryParams).toEqual({status: 'PA', fullName: 'James2 Black2'});
    expect(component.feeClerks[0].readyToReview).toBe(1);
    expect(component.feeClerks[1].readyToReview).toBe(2);
    expect(component.feeClerks[2].readyToReview).toBe(1);
  });

  it('should populate the sr fee clerk array', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    component.status = 'A';
    component.seniorFeeClerks = [];
    component.createSeniorFeeClerksOverview(JSON.parse(clerkData));
    expect(component.seniorFeeClerks.length).toBeGreaterThan(0);
    expect(component.seniorFeeClerks[0].readyToTransferToBar).toBe(1);
    expect(component.seniorFeeClerks[1].readyToTransferToBar).toBe(2);
    expect(component.seniorFeeClerks[2].readyToTransferToBar).toBe(1);
  });

  it('should populate the sr fee clerk rejected payments', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(SR_FEE_CLERK_USER_OBJECT);
    component.status = 'A';
    component.seniorFeeClerks = [];
    component.createRejectStatsOverview(JSON.parse(clerkData));
    expect(component.feeClerks.length).toBeGreaterThan(0);
    expect(component.feeClerks[0].readyToReview).toBe(1);
    expect(component.feeClerks[1].readyToReview).toBe(2);
    expect(component.feeClerks[2].readyToReview).toBe(1);
  });

  it('should populate the delivery manager payments', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    component.status = 'A';
    component.deliveryManagers = [];
    component.handleDeliveryManagerData(JSON.parse(clerkData));
    expect(component.deliveryManagers.length).toBeGreaterThan(0);
    expect(component.deliveryManagers[0].readyToTransferToBar).toBe(1);
    expect(component.deliveryManagers[1].readyToTransferToBar).toBe(2);
    expect(component.deliveryManagers[2].readyToTransferToBar).toBe(1);
  });

  it('clicking on confirm button the modal should be displayed with date selector', fakeAsync(() => {
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockCurrentTimeResponse(1534676340000);
    });
    const modal = fixture.nativeElement.querySelector('.hmcts-modal');
    expect(modal.parentElement.hidden).toBeTruthy();
    component.openedTab = 4;
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector('#sendToPayhubBtn');
    confirmButton.click();
    tick();
    fixture.detectChanges();
    expect(modal.parentElement.hidden).toBeFalsy();
    expect(component.transferDate).toBe('2018-08-18');
    const cancelButton = fixture.nativeElement.querySelector('#closeModalBtn');
    cancelButton.click();
    tick();
    fixture.detectChanges();
    expect(modal.parentElement.hidden).toBeTruthy();
  }));

  it('when the date is 2018-08-19 10:59 UTC then the selected date is the previous date because of the day light saving', fakeAsync(() => {
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockCurrentTimeResponse(1534676340000);
    });
    component.openModal();
    expect(component.transferDate).toBe('2018-08-18');
  }));

  it('when the date is 2018-08-19 12:00 then the selected date is the current date because of the day light saving', fakeAsync(() => {
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockCurrentTimeResponse(1534676400000);
    });
    component.openModal();
    expect(component.transferDate).toBe('2018-08-19');
  }));

  it('when the date is 2018-11-19 11:59 UTC then the selected date is the previous date because no day light saving', fakeAsync(() => {
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockCurrentTimeResponse(1542628740000);
    });
    component.openModal();
    expect(component.transferDate).toBe('2018-11-18');
  }));

  it('when the date is 2018-08-19 12:00 then the selected date is the current date because no day light saving', fakeAsync(() => {
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockCurrentTimeResponse(1542632340000);
    });
    component.openModal();
    expect(component.transferDate).toBe('2018-11-19');
  }));

  it('clicking continue on date selector should show the result of payhub upload', fakeAsync(() => {
    const modal = fixture.nativeElement.querySelector('.hmcts-modal');
    expect(modal.parentElement.hidden).toBeTruthy();
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return mockHttpClient(url);
    });
    component.openedTab = 4;
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector('#sendToPayhubBtn');
    confirmButton.click();
    tick();
    fixture.detectChanges();
    expect(modal.parentElement.hidden).toBeFalsy();
    const continueButton = fixture.nativeElement.querySelector('#confirmButton');
    continueButton.click();
    tick();
    fixture.detectChanges();
    expect(modal.parentElement.hidden).toBeFalsy();
    expect(component.payhubReport).toEqual({
      total: 500,
      success: 498
    });
  }));

});

function mockHttpClient(url) {
  return new Observable(observer => {
    observer.next({
      total: 500,
      success: 498
    });
    observer.complete();
  });
}

function mockCurrentTimeResponse(currentTime) {
  return new Observable(observer => {
    observer.next({ currentTime });
    observer.complete();
  });
}
