import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeeDetailComponent } from './feedetail.component';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { FeelogServiceMock } from '../../../test-mocks/feelog.service.mock';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { EditTypes, UnallocatedAmountEventMessage } from './feedetail.event.message';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FeeSearchModel } from '../../../models/feesearch.model';
import { Location, LocationStrategy } from '@angular/common';
import { instance, mock } from 'ts-mockito';
import { SimpleChange, SimpleChanges } from '@angular/core';


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
  let location: Location;

  beforeEach(() => {

    location = instance(mock(Location));
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FeeDetailComponent]
    });

    TestBed.overrideComponent(FeeDetailComponent, {
      set: {
        providers: [
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: Location, useValue: location }
        ]
      }
    });

    fixture = TestBed.createComponent(FeeDetailComponent);
    spyOn(location, 'replaceState').and.callFake(params => {
      console.log(params);
    });
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
    expect(component.searchQuery).toBe('');
    expect(component.feeSelectorOn).toBeFalsy();
  });

  it('should reset data and the right fields / object properties', () => {
    component.resetForm();
    expect(component.feeCodesSearch.length).toBe(0);
    expect(component.searchQuery).toBe('');
    expect(component.selectorVisible).toBeFalsy();
    expect(component.feeDetailCopy).toBeNull();
    expect(component.isRemissionVisible).toBeFalsy();
    expect(component.isRefundVisible).toBeFalsy();
    expect(component.caseSelectorOn).toBeFalsy();
    expect(component.unallocatedAmount).toBe(0);
  });

  it('should populate feeDetails with empty value', async() => {
    const e = {
      preventDefault() {
        return true;
      }
    };
    component.searchQuery = '';
    component.onKeyUpFeeCodesAndDescriptions(e);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.feeCodesSearch.length).toBe(0);
    expect(component.selectorVisible).toBeFalsy();
  });

  it('should populate feeDetails with result', (done) => {
    const e = {
      preventDefault() {
        return true;
      }
    };
    component.searchQuery = 'X0';
    component.onKeyUpFeeCodesAndDescriptions(e)
      .then(() => {
        expect(component.feeCodesSearch.length).toBe(2);
        expect(component.selectorVisible).toBeTruthy();
        done();
      });
  });

  it('pressing save button trigger validation and show error', () => {
    const saveBtn = fixture.debugElement.query(By.css('#save'));
    saveBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    const caseInputSection = fixture.debugElement.query(By.css('#caseInputSection'));
    const caseSelectSection = fixture.debugElement.query(By.css('#caseSelectSection'));
    const feeSelectorSection = fixture.debugElement.query(By.css('#feeSelectorSection'));
    expect(caseInputSection.nativeElement.className).toContain('form-group-error');
    expect(feeSelectorSection.nativeElement.className).toContain('form-group-error');
    expect(caseSelectSection.nativeElement.className).toContain('form-group-error');
  });

  it('selecting a fee removes the error from the component', () => {
    // select a model
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

    // click save button
    const saveBtn = fixture.debugElement.query(By.css('#save'));
    saveBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    // check errors
    const caseInputSection = fixture.debugElement.query(By.css('#caseInputSection'));
    const caseSelectSection = fixture.debugElement.query(By.css('#caseSelectSection'));
    const feeSelectorSection = fixture.debugElement.query(By.css('#feeSelectorSection'));
    expect(caseInputSection.nativeElement.className).toContain('form-group-error');
    expect(feeSelectorSection.nativeElement.className).not.toContain('form-group-error');
    expect(caseSelectSection.nativeElement.className).toContain('form-group-error');
  });

  it('writing case refernce into the input removes the error from the case reference section', () => {
    component.case_reference = '123456';
    // click save button
    const saveBtn = fixture.debugElement.query(By.css('#save'));
    saveBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    // check errors
    const caseInputSection = fixture.debugElement.query(By.css('#caseInputSection'));
    const caseSelectSection = fixture.debugElement.query(By.css('#caseSelectSection'));
    const feeSelectorSection = fixture.debugElement.query(By.css('#feeSelectorSection'));
    expect(caseInputSection.nativeElement.className).not.toContain('form-group-error');
    expect(feeSelectorSection.nativeElement.className).toContain('form-group-error');
    expect(caseSelectSection.nativeElement.className).not.toContain('form-group-error');
  });

  it('run logic after pressing back button', () => {
    spyOn(component, 'onGoBack').and.callThrough();
    spyOn(component, 'onSavePressed').and.callThrough();
    component.isVisible = true;
    component._savePressed = true;
    component.onPopState({});
    expect(component.onGoBack).toHaveBeenCalledTimes(0);
    expect(component.onSavePressed).toHaveBeenCalledTimes(1);
    component._savePressed = false;
    component.onPopState({});
    expect(component.onGoBack).toHaveBeenCalledTimes(1);
    expect(component.onSavePressed).toHaveBeenCalledTimes(1);
    component.isVisible = false;
    component.onPopState({});
    expect(component.onGoBack).toHaveBeenCalledTimes(1);
    expect(component.onSavePressed).toHaveBeenCalledTimes(1);
  });

  it('test calling onSavePressed', () => {
    const model = createFeeDetailModel();
    component.feeDetail = model;
    component.type = EditTypes.CREATE;
    const feedetailChange = instance(mock(SimpleChange));
    feedetailChange.currentValue = model;
    feedetailChange.previousValue = {};
    component.ngOnChanges(<SimpleChanges> { feeDetail: feedetailChange });

    spyOn(component.onAmountChange, 'emit').and.callThrough();
    spyOn(component.onCloseComponent, 'emit').and.callThrough();

    component.onSavePressed();

    expect(component.onAmountChange.emit).toHaveBeenCalledWith(new UnallocatedAmountEventMessage(0, 0, 0));
    expect(component.onCloseComponent.emit).toHaveBeenCalledWith({
      feeDetail: model,
      originalFeeDetail: model,
      editType: EditTypes.CREATE
    });
    expect(component.feeSelectorOn).toBeFalsy();
    expect(component.selectorVisible).toBeFalsy();
    expect(component._savePressed).toBeFalsy();
  });
});
