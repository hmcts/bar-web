import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CheckSubmitComponent } from './check-submit.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { UtilService } from '../../services/util/util.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';

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
        { provide: Router, useValue: mockRouter }, {
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
