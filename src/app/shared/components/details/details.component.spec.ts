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
import { Observable } from 'rxjs/Observable';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  class ActivateRouteMock {
    get parent() {
      return {
        params: of({ id: 2 })
      };
    }
    get params() {
      return new Observable(observer => {
        observer.next({id: '2'}),
          observer.complete();
      });
    }
  }

  // trigger this method before every test
  beforeEach(async() => {
    // Prepare the mock modules
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])],
      declarations: [DetailsComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: BarHttpClient },
        { provide: ActivatedRoute, useClass: ActivateRouteMock },
        { provide: PaymentslogService, useClass: PaymentLogServiceMock },
        { provide: PaymenttypeService, useClass: PaymentTypeServiceMock }
      ]
    }).compileComponents();

    // create the mock component
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create component.', () => {
    expect(component).toBeTruthy();
  });
});
