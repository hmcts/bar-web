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
import {Location} from '@angular/common';
import { first } from 'lodash';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let locationService: Location;

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

  const LocationMock = {
    back() {
      return 'triggered.';
    }
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
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: Location, useValue: LocationMock }
        ]
      }
    });

    // create the mock component
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    locationService = fixture.debugElement.injector.get(Location);
    fixture.detectChanges();
  });

  it('should create component.', () => {
    expect(component).toBeTruthy();
  });

  it('expect to go back', () => {
    spyOn(locationService, 'back');
    component.onGoBack();
    expect(locationService.back).toHaveBeenCalled();
  });

  it('should expect to have selected all payment instructions.', async() => {
    component.onSelectAll();
    await fixture.whenStable();
    const checked = component
      .paymentInstructions$
      .getValue()
      .filter(paymentInstruction => !paymentInstruction.checked);
    expect(checked.length).toBe(0);
  });

  it('should ensure that the element that\'s being checked is actually been checked.', async() => {
    await fixture.whenStable();
    const firstPaymentInstruction = first(component.paymentInstructions$.getValue());
    component.onToggleChecked(firstPaymentInstruction);
    expect(firstPaymentInstruction.checked).toBeTruthy();
  });


});
