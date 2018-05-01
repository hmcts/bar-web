import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CheckSubmitComponent } from './check-submit.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../../../shared/services/util/util.service';
import {UserService} from '../../../shared/services/user/user.service';
import {UserServiceMock} from '../../test-mocks/user.service.mock';

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

describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [CheckSubmitComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      providers: [
        PaymentslogService,
        UtilService,
        {
          provide: UserService,
          useValue: UserServiceMock
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
    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    mockActivatedRoute.testParams = { id: '1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
