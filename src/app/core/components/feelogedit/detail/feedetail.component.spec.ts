import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeeDetailComponent } from './feedetail.component';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { FeelogServiceMock } from '../../../test-mocks/feelog.service.mock';
import { PaymenttypeService } from '../../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../../test-mocks/payment-type.service.mock';
import { PaymentslogService } from '../../../services/paymentslog/paymentslog.service';
import { PaymentLogServiceMock } from '../../../test-mocks/payment-log.service.mock';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { EditTypes } from './feedetail.event.message';
import { FormsModule } from '@angular/forms';


describe('Component: FeedetailComponent', () => {

  let component: FeeDetailComponent;
  let fixture: ComponentFixture<FeeDetailComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FeeDetailComponent]
    });

    TestBed.overrideComponent(FeeDetailComponent, {
      set: {
        providers: [
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(FeeDetailComponent);
    component = fixture.componentInstance;
    component.currency = 'GBP';
    fixture.detectChanges();
  });

  it('should create', () => {
    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.amount = 0;
    feeDetailModel.refund_amount = 0;
    feeDetailModel.remission_authorisation = '';
    feeDetailModel.remission_benefiter = '';
    feeDetailModel.refund_amount = 0;
    feeDetailModel.case_reference = '';
    component.isVisible = true;
    component.type = EditTypes.CREATE;
    component.feeDetail = feeDetailModel;
    component.isRefundEnabled = false;
    component.previousCases = [];

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
