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
import { By } from '@angular/platform-browser';


describe('Component: FeedetailComponent', () => {
  const createFeeDetailModel = () => {
    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.refund_amount = 0;
    feeDetailModel.amount = 0;
    feeDetailModel.remission_benefiter = '';
    feeDetailModel.refund_amount = 0;
    feeDetailModel.case_reference = '';
    feeDetailModel.remission_authorisation = '';
    return feeDetailModel;
  };
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

    component.isVisible = true;
    component.type = EditTypes.CREATE;
    component.feeDetail = createFeeDetailModel();
    component.isRefundEnabled = false;
    component.previousCases = [];

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('clicking on remission checkbox the remission section should appear', () => {
    component.isVisible = true;
    component.type = EditTypes.CREATE;
    component.feeDetail = createFeeDetailModel();
    component.isRefundEnabled = false;
    component.previousCases = [];
    const remissionChk = fixture.debugElement.query(By.css('#remission')).nativeElement;
    const remissionBlock = fixture.nativeElement.querySelector('#remission-section');
    remissionChk.click();
    fixture.detectChanges();
    expect(remissionBlock.hidden).toBeFalsy();
    component.feeDetail.remission_amount = 500;
    // hide it again
    remissionChk.click();
    fixture.detectChanges();
    expect(remissionBlock.hidden).toBeTruthy();
    expect(component.feeDetail.remission_amount).toBeNull();
  });

  it('clicking on refund checkbox (when visible) the remission section should appear', () => {
    component.isVisible = true;
    component.type = EditTypes.CREATE;
    component.feeDetail = createFeeDetailModel();
    component.isRefundEnabled = true;
    component.previousCases = [];
    const refundChk = fixture.debugElement.query(By.css('#refund')).nativeElement;
    const refundBlock = fixture.nativeElement.querySelector('#refund-section');
    refundChk.click();
    fixture.detectChanges();
    expect(refundBlock.hidden).toBeFalsy();
    component.feeDetail.refund_amount = 500;
    // hide it again
    refundChk.click();
    fixture.detectChanges();
    expect(refundBlock.hidden).toBeTruthy();
    expect(component.feeDetail.refund_amount).toBeNull();
  });
});
