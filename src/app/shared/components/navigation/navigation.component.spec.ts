import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { UserService } from '../../../shared/services/user/user.service';
import { NavigationTrackerService } from '../../../shared/services/navigationtracker/navigation-tracker.service';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchService } from '../../../core/services/search/search.service';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { CookieService } from 'ngx-cookie-service';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../core/test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import { UserServiceMock } from '../../../core/test-mocks/user.service.mock';
import { UserModel } from '../../../core/models/user.model';
import { By } from '@angular/platform-browser';
import { PaymentInstructionsService } from '../../../core/services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../../core/test-mocks/payment-instruction.service.mock';
import { BarHttpClient } from '../../services/httpclient/bar.http.client';
import { PaymentstateServiceMock } from '../../../core/test-mocks/paymentstate.service.mock';
import { BarHttpClientMock } from '../../../core/test-mocks/bar.http.client.mock';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';
import {of} from 'rxjs';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-post-clerk']
});

const models: PaymentInstructionModel[] = [];

class MockRouter {
  get url() {
    return '/search';
  }

  navigateByUrl(url: string): string {
    console.log(url);
    return url;
  }

  get events() {
    return of({});
  }

  createUrlTree() {
    return of({});
  }

  serializeUrl(urlTree) {
    return '';
  }
}

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let searchService: SearchService;
  let userService: UserService;
  let navigationtracker: NavigationTrackerService;
  let paymentInstructionsService: PaymentInstructionsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      providers: [ NavigationTrackerService, UserService, CookieService, SearchService, BarHttpClient,
        { provide: PaymentStateService, useClass: PaymentstateServiceMock }]
    }).overrideComponent(NavigationComponent, {
      set: {
        providers: [
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    fixture = TestBed.createComponent(NavigationComponent);
    navigationtracker = fixture.debugElement.injector.get(NavigationTrackerService);
    searchService = fixture.debugElement.injector.get(SearchService);
    userService = fixture.debugElement.injector.get(UserService);
    paymentInstructionsService = fixture.debugElement.injector.get(PaymentInstructionsService);
    router = fixture.debugElement.injector.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform search', () => {
    spyOn(paymentInstructionsService, 'transformJsonIntoPaymentInstructionModels').and.returnValue(models);
    spyOn(searchService, 'createPaymentInstructions').and.callThrough();
    spyOn(router, 'navigateByUrl');
    component.performQuerySearch();
    expect(router.url).toEqual('/search');
  });

  it('showing advanced search when the user is a fee-clerk', async(() => {
    expect(fixture.nativeElement.innerHTML).toContain('advanced-search-link');
  }));

  it('hiding advanced search when the user is NOT a fee-clerk', async(() => {
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('advanced-search-link');
  }));

  it('advanced search is is hidden by default', () => {
    expect(fixture.nativeElement.innerHTML).not.toContain('payment-type');
  });

  it('clicking on the advanced link the advanced panel should be shown', async(() => {
    fixture.debugElement.nativeElement.querySelector('#advanced-search-link').click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('payment-type');
    });
  }));

  it('in advanced search changes are reflected back to searchmodel', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.searchModel.status).toEqual('P');
    fixture.debugElement.nativeElement.querySelector('#advanced-search-link').click();
    fixture.detectChanges();
    tick();
    const statusSelector = fixture.debugElement.query(By.css('#status'));
    statusSelector.nativeElement.selectedIndex = 2;
    statusSelector.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick();
    expect(component.searchModel.status).toEqual('PA');

    statusSelector.nativeElement.selectedIndex = 3;
    statusSelector.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick();
    expect(component.searchModel.status).toEqual('A');

    statusSelector.nativeElement.selectedIndex = 0;
    statusSelector.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick();
    expect(component.searchModel.status).toEqual(component.allStatuses.join(','));
  }));

  it('if navigationtracker set the visibility hidden then advenced searxh should be hidden too', () => {
    component.advancedSearchedOpen = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('payment-type');
    navigationtracker.isSearchVisible = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('payment-type');
  });

  it('should return the valid number of paymentlogs', () => {
    expect(component.searchResults).toBe(searchService.paymentLogs);
  });

});
