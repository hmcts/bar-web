import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { FeelogService } from '../../services/feelog/feelog.service';

import { PaymentInstructionListComponent } from './payment-instruction-list.component';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SearchService } from '../../services/search/search.service';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { CardComponent } from '../../../shared/components/card/card.component';

let mockRouter: any;
let mockActivatedRoute: any;

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockActivatedRoute {
    private paramsSubject = new BehaviorSubject(this.testParams);
    private _testParams: {};

    params = this.paramsSubject.asObservable();

    get testParams() {
      return this._testParams;
    }
    set testParams(newParams: any) {
      this._testParams = newParams;
      this.paramsSubject.next(newParams);
    }
}

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-delivery-manager', 'bar-fee-clerk']
});

describe('PaymentInstructionListComponent', () => {
  let component: PaymentInstructionListComponent;
  let fixture: ComponentFixture<PaymentInstructionListComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [CardComponent, PaymentInstructionListComponent, UpperCaseFirstPipe],
      providers: [
        SearchService,
        UserService,
        CookieService,
        FeelogService,
        SearchService,
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInstructionListComponent);
    component = fixture.componentInstance;
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);
    mockActivatedRoute.testParams = { id: '1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
