import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import { PaymentReviewComponent } from './payment-review.component';
import {PaymentslogService} from '../../services/paymentslog/paymentslog.service';
import {PaymenttypeService} from '../../services/paymenttype/paymenttype.service';
import { UtilService } from '../../../shared/services/util/util.service';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router, RouterLinkWithHref, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SharedModule } from '../../../shared/shared.module';

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

describe('PaymentReviewComponent', () => {
  let component: PaymentReviewComponent;
  let fixture: ComponentFixture<PaymentReviewComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentReviewComponent, CardComponent ],
      providers: [
        PaymentslogService,
        PaymenttypeService,
        UtilService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
