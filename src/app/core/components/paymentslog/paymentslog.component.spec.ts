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
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';

let mockRouter: any;
let mockActivatedRoute: any;

class MockRouter {
  navigateByUrl(url: string) { return url; }
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

describe('PaymentslogComponent', () => {
  let component: PaymentslogComponent;
  let fixture: ComponentFixture<PaymentslogComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ CardComponent, PaymentslogComponent, UpperCaseFirstPipe, NumbersOnlyDirective ],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        CookieService, PaymentslogService,
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
