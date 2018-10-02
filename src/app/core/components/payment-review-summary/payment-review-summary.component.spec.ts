import { PaymentReviewSummaryComponent } from './payment-review-summary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../test-mocks/paymentsoverview.service.mock';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';
import { By } from '@angular/platform-browser';

describe('PaymentReviewSummaryComponent', () => {
  let component: PaymentReviewSummaryComponent;
  let fixture: ComponentFixture<PaymentReviewSummaryComponent>;
  let router: Router;
  let routerSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ PaymentReviewSummaryComponent, CardComponent ],
      providers: [
        UserService,
        CookieService,
        BarHttpClient
      ]
    }).overrideComponent(PaymentReviewSummaryComponent, {
      set: {
        providers: [
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentReviewSummaryComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    routerSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    fixture.detectChanges();
  });

  it('after init the cards should be displayed on the page', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.numOfPaymentInstructions).toBe(5);
  });
});
