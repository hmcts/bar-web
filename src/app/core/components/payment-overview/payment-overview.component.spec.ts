import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLinkWithHref, RouterModule} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RouterTestingModule} from '@angular/router/testing';
import { UserService } from '../../../shared/services/user/user.service';

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

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentOverviewComponent ],
      providers: [
        PaymentslogService,
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    mockActivatedRoute.testParams = { id: '1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should show the right number of validated payments', () => {
    const validatedCount = component.count.validated;
  });
});
