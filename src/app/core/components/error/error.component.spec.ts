import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';
import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

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

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ErrorComponent, ModalComponent, NumbersOnlyDirective ],
      providers: [
        UserService,
        CookieService,
        PaymenttypeService,
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
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it('when no route param then should show app error', () => {
    mockActivatedRoute.testParams = {};
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Application error');
  });

  it('when 401 then should show Access denied', () => {
    mockActivatedRoute.testParams = { errorCode: '401' };
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Access denied');
  });

  it('when 403 then should show Forbidden', () => {
    mockActivatedRoute.testParams = { errorCode: '403' };
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Forbidden');
  });

  it('when 404 then should show Not found', () => {
    mockActivatedRoute.testParams = { errorCode: '404' };
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Document not found');
  });

  it('when 500 then should show Not found', () => {
    mockActivatedRoute.testParams = { errorCode: '500' };
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Application error');
  });
});
