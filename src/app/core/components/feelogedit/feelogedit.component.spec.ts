import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FeelogeditComponent } from './feelogedit.component';
import { FeeLogModel } from '../../models/feelog.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user/user.service';
import { NavigationTrackerService } from '../../../shared/services/navigationtracker/navigation-tracker.service';
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { FormatPound } from '../../../pipes/format-pound.pipe';

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

describe('FeelogeditComponent', () => {
  let component: FeelogeditComponent;
  let fixture: ComponentFixture<FeelogeditComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ FeelogeditComponent, HmctsModalComponent, FormatPound ],
      providers: [
        NavigationTrackerService,
        PaymentstateService,
        UserService,
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
    fixture = TestBed.createComponent(FeelogeditComponent);
    component = fixture.componentInstance;
    mockActivatedRoute.testParams = { id: '1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
