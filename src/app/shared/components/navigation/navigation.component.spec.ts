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
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { CookieService } from 'ngx-cookie-service';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../core/test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import { UserServiceMock } from '../../../core/test-mocks/user.service.mock';
import { UserModel } from '../../../core/models/user.model';
import { By } from '@angular/platform-browser';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-post-clerk']
});

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let userService: UserService;
  let navigationtracker: NavigationTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule,  RouterTestingModule.withRoutes([])],
      providers: [ NavigationTrackerService, PaymentstateService, UserService, CookieService, SearchService ]
    }).overrideComponent(NavigationComponent, {
      set: {
        providers: [
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(NavigationComponent);
    userService = fixture.debugElement.injector.get(UserService);
    navigationtracker = fixture.debugElement.injector.get(NavigationTrackerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(component.searchModel.status).toEqual('P');
    fixture.debugElement.nativeElement.querySelector('#advanced-search-link').click();
    fixture.detectChanges();
    tick();
    const statusSelector = fixture.debugElement.query(By.css('#status'));
    statusSelector.nativeElement.selectedIndex = 2;
    statusSelector.nativeElement.dispatchEvent(new Event('change'));
    statusSelector.triggerEventHandler('change', null);
    fixture.detectChanges();
    tick();
    expect(component.searchModel.status).toEqual('PA');
    statusSelector.nativeElement.selectedIndex = 0;
    statusSelector.nativeElement.dispatchEvent(new Event('change'));
    statusSelector.triggerEventHandler('change', null);
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
});
