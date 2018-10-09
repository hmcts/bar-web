import { ComponentFixture, TestBed} from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { By } from '@angular/platform-browser';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { PaymentsOverviewService } from '../../../core/services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock } from '../../../core/test-mocks/paymentsoverview.service.mock';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let router: Router;
  let routerSpy: any;
  const mockActivatedRoute = {
    params: new Observable(observer => {
      observer.next({ id: 1 });
      observer.complete();
    }),
    queryParams: new Observable(observer => {
      observer.next({ status: PaymentStatus.getPayment('Approved').code, fullName: 'Joseph' });
      observer.complete();
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [CardComponent, StatsComponent]
    }).overrideComponent(StatsComponent, {
      set: {
        providers: [
          { provide: PaymentsOverviewService, useClass: PaymentsOverviewServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }
    });
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    routerSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    fixture.detectChanges();
  });

  it('after init the cards should be displayed on the page', async() => {
    waits(500);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.numOfPaymentInstructions).toBe(5);
      expect(component.sumValueOfPaymentInstructions).toBe(275000);
    });
  });

  it('clicking on a card changes location', async () => {
    const card = {
      bgc: null,
      status: 'PA',
      user_id: '365751',
      _links: {
        'stat-details': {
          href: 'http://localhost:8080/users/100/payment-instructions?status=PA&paymentType=CHEQUE'
        },
        'stat-group-details': {
          href: 'http://localhost:8080/users/100/payment-instructions?status=PA&paymentType=CHEQUE,POSTAL_ORDER'
        }
      },
      count: 1,
      payment_type: 'merged',
      payment_type_name: 'Cheque & Postal order',
      total_amount: 200
    };

    await fixture.whenStable();
    fixture.detectChanges();
    component.cardClicked(card);
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
