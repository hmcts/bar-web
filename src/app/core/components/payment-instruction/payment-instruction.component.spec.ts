import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentInstructionComponent } from './payment-instruction.component';
import { ModalComponent } from './../modal/modal.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { UserService } from '../../../shared/services/user/user.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { CookieService } from 'ngx-cookie-service';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import { PaymentInstructionServiceMock } from '../../test-mocks/payment-instruction.service.mock';

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

describe('PaymentInstructionComponent', () => {
  let component: PaymentInstructionComponent;
  let fixture: ComponentFixture<PaymentInstructionComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentInstructionComponent, ModalComponent, NumbersOnlyDirective ],
      providers: [
        UserService,
        CookieService,
        PaymenttypeService,
        {
          provide: PaymentInstructionsService,
          useClass: PaymentInstructionServiceMock
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
    fixture = TestBed.createComponent(PaymentInstructionComponent);
    component = fixture.componentInstance;
    mockActivatedRoute.testParams = { id: '2' };
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
