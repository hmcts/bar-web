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
import { FeeSearchModel } from '../../../models/feesearch.model';


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

  it('toggleFeeSelector', () => {
    component.toggleFeeSelector();
    expect(component.feeSelectorOn).toBeTruthy();
  });

  it('loadFeeCodesAndDescriptions', () => {

  });

  it('should have correct feeDetail data', () => {
    const model: FeeSearchModel = new FeeSearchModel();
    const mockData = {
      code: 'X0410',
      current_version: {
        description: 'Supply published decisions to supplier (each page)',
        flat_amount: { amount: 19999 },
        version: '5'
      }
    };

    component.feeDetailCopy = new FeeDetailModel();
    model.assign(mockData);

    component.selectFee(model);
    expect(component.selectorVisible).toBeFalsy();
    expect(component.feeDetail.fee_code).toBe('X0410');
    expect(component.feeDetail.fee_description).toBe('Supply published decisions to supplier (each page)');
    expect(component.feeDetail.amount).toBe(19999);
    expect(component.feeDetail.fee_version).toBe('5');
    expect(component.searchFeeModel).toBe('');
    expect(component.feeSelectorOn).toBeFalsy();
  });

  it('should reset data and the right fields / object properties', () => {
    component.resetForm();
    expect(component.feeCodesSearch.length).toBe(0);
    expect(component.searchFeeModel).toBe('');
    expect(component.selectorVisible).toBeFalsy();
    expect(component.feeDetailCopy).toBeNull();
    expect(component.isRemissionVisible).toBeFalsy();
    expect(component.isRefundVisible).toBeFalsy();
    expect(component.caseSelectorOn).toBeFalsy();
    expect(component.unallocatedAmount).toBe(0);
  });

  it('should have populate feeDetails correctly', () => {
    const e = {
      preventDefault() {
        return true;
      }
    };
    component.searchFeeModel = '';
    component.onKeyUpFeeCodesAndDescriptions(e);
    expect(component.feeCodesSearch.length).toBe(0);
    expect(component.selectorVisible).toBeFalsy();
  });

  it('should have populate feeDetails correctly', () => {
    const e = {
      preventDefault() {
        return true;
      }
    };
    component.searchFeeModel = 'X0';
    component.onKeyUpFeeCodesAndDescriptions(e);
    expect(component.feeCodesSearch.length).toBe(0);
    expect(component.selectorVisible).toBeTruthy();
  });
});
