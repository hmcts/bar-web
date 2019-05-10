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
import {of, Observable} from 'rxjs';
import { SitesService } from '../../services/sites/sites.service';
import { SitesServiceMock } from '../../../core/test-mocks/sites.service.mock';


const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-post-clerk']
});

const MULTISITES_OBJECT = [{id: 'Y431', description: 'BROMLEY COUNTY COURT', email: []},
{id: 'SITE2', description: 'SITE2 COUNTY COURT', email: []},
{id: 'SITE3', description: 'SITE3 COUNTY COURT', email: []}];

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
  let sitesService: SitesService;
  let router: Router;
  const e = {
    preventDefault() {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      providers: [ NavigationTrackerService, UserService, CookieService, SearchService, BarHttpClient, SitesService,
        { provide: PaymentStateService, useClass: PaymentstateServiceMock }]
    }).overrideComponent(NavigationComponent, {
      set: {
        providers: [
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: SitesService, useClass: SitesServiceMock },
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
    sitesService = fixture.debugElement.injector.get(SitesService);
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

  it('should perform search by date', () => {
    spyOn(paymentInstructionsService, 'transformJsonIntoPaymentInstructionModels').and.returnValue(models);
    spyOn(searchService, 'createPaymentInstructions').and.callThrough();
    spyOn(router, 'navigateByUrl');
    component.performQueryByDate(e);
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
    expect(component.searchModel.status).toEqual('P,PA,A,V,TTB,REJ,C');
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

  it('should show the sites with description only and hide dropdown when sites length is 1', () => {
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('BROMLEY COUNTY COURT');
    expect(fixture.nativeElement.innerHTML).not.toContain('sites-drop-down');
  });

  it('should show the sites with dropdown when sites length is > than 1', () => {
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    spyOn(sitesService, 'getSites').and.returnValue(of(MULTISITES_OBJECT));
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('sites-drop-down');
  });

  it('test setting the the date in advanced search', () => {
    component.startDate = '2019-01-08';
    expect(component.endDate).toEqual('');
    expect(component.searchModel.startDate).toEqual('08012019');
    expect(component.startDate).toEqual('2019-01-08');

    component.startDate = 'some unparseble date';
    expect(component.endDate).toEqual('');
    expect(component.searchModel.startDate).toEqual('Invalid date');

    component.endDate = '2019-01-10';
    expect(component.searchModel.endDate).toEqual('10012019');
    expect(component.endDate).toEqual('2019-01-10');
  });

  it('should showing correct sites description', () => {
    expect(component.searchResults).toBe(searchService.paymentLogs);
  });


});
