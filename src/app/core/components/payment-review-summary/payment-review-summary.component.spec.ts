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
import { PaymentStateServiceMock } from '../../test-mocks/paymentstate.service.mock';
import { PaymentStatus } from '../../models/paymentstatus.model';

describe('PaymentReviewSummaryComponent', () => {
  let component: PaymentReviewSummaryComponent;
  let fixture: ComponentFixture<PaymentReviewSummaryComponent>;
  let router: Router;

  const MockActivatedRoute = {
    params: { id: '364087' },
    queryParams: {
      status: PaymentStatus.getPayment('PA').code,
      fullName: 'Tony Houston'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentReviewSummaryComponent, CardComponent],
      providers: [ UserService, CookieService, BarHttpClient ]
    }).overrideComponent(PaymentReviewSummaryComponent, {
      set: {
        providers: [
          { provide: PaymentStateService, useClass: PaymentStateServiceMock },
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: ActivatedRoute, useValue: MockActivatedRoute }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentReviewSummaryComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  xit('after init the cards should be displayed on the page', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.numOfPaymentInstructions).toBe(0);
  });
});
