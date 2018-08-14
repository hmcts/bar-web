import { DetailsComponent } from './details.component';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../core/test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../core/test-mocks/payment-type.service.mock';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {RouterModule, ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BarHttpClient } from '../../services/httpclient/bar.http.client';
import { of } from 'rxjs/observable/of';
import {PaymentStatus} from '../../../core/models/paymentstatus.model';
import {PaymentInstructionsService} from '../../../core/services/payment-instructions/payment-instructions.service';
import {PaymentInstructionServiceMock} from '../../../core/test-mocks/payment-instruction.service.mock';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const ActivateRouteMock = {
    parent: {
      parent: {},
      params: of({ id: 1 }),
      queryParams: of({
        status: PaymentStatus.getPayment('Approved').code,
        paymentType: 'cash'
      })
    },
    params: of({ id: 1 }),
    queryParams: of({
      status: PaymentStatus.getPayment('Approved').code,
      paymentType: 'cash'
    })
  };

  // trigger this method before every test
  beforeEach(async() => {
    // Prepare the mock modules
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
    }).overrideComponent(DetailsComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useValue: ActivateRouteMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymentInstructionsService, useClass: PaymentInstructionServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock }
        ]
      }
    });

    // create the mock component
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component.', () => {
    expect(component).toBeTruthy();
  });
});
