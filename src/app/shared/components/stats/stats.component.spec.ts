import { ComponentFixture, TestBed} from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { By } from '@angular/platform-browser';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { PaymentsOverviewService } from '../../../core/services/paymentoverview/paymentsoverview.service';
import { PaymentsOverviewServiceMock, stats } from '../../../core/test-mocks/paymentsoverview.service.mock';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';


describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let router: Router;
  let callbackSpy: any;
  const mockActivatedRoute = {
    params: of({ id: 1 }),
    queryParams: of({ status: PaymentStatus.getPayment('Approved').code, fullName: 'Joseph' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule,
        RouterTestingModule.withRoutes([
          { path: 'users/365751/payment-instructions/stats/details', redirectTo: '' }
        ])],
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
    callbackSpy = spyOn(component.onCardClicked, 'emit').and.callThrough();
    component.action = { action: 'Process' };
    component.content = [JSON.parse(stats)[0]];
    fixture.detectChanges();
  });

  it('after init the cards should be displayed on the page', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.numOfPaymentInstructions).toBe(5);
    expect(component.sumValueOfPaymentInstructions).toBe(275000);
  });

  it('clicking on a card changes location', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    const firstCard = fixture.debugElement.query(By.css('.card:first-child'));
    firstCard.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(callbackSpy).toHaveBeenCalledWith({
      query: 'http://localhost:8080/users/365751/payment-instructions?status=PA&paymentType=CHEQUE,POSTAL_ORDER',
      fullName: 'Joseph'
    });
  });
});
