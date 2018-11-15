import { PaymentReviewSummaryComponent } from './payment-review-summary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../test-mocks/paymentsoverview.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentstateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { of } from 'rxjs';
import { StatsComponent } from '../../../shared/components/stats/stats.component';
import { DetailsComponent } from '../../../shared/components/details/details.component';
import { FormsModule } from '@angular/forms';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only/numbers-only.directive';

describe('PaymentReviewSummaryComponent', () => {
  let component: PaymentReviewSummaryComponent;
  let fixture: ComponentFixture<PaymentReviewSummaryComponent>;
  let router: Router;

  const MockActivatedRoute = {
    params: of({ id: '364087' }),
    queryParams: of({
      status: PaymentStatus.getPayment('PA').code,
      fullName: 'Tony Houston'
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]), FormsModule ],
      declarations: [ PaymentReviewSummaryComponent, CardComponent, StatsComponent, DetailsComponent, NumbersOnlyDirective],
      providers: [ UserService, CookieService, BarHttpClient ]
    }).overrideComponent(PaymentReviewSummaryComponent, {
      set: {
        providers: [
          { provide: PaymentStateService, useClass: PaymentstateServiceMock },
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: ActivatedRoute, useValue: MockActivatedRoute },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentReviewSummaryComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('after init the cards should be displayed on the page', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.numOfPaymentInstructions['Process']).toBe(5);
  });
});
