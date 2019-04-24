import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FeeDetailComponent} from './feedetail.component';
import {FeelogService} from '../../../services/feelog/feelog.service';
import {FeelogServiceMock} from '../../../test-mocks/feelog.service.mock';
import {BarHttpClientMock} from '../../../test-mocks/bar.http.client.mock';

import {FeeDetailModel} from '../../../models/feedetail.model';
import {EditTypes} from './feedetail.event.message';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {FeeSearchModel} from '../../../models/feesearch.model';
import {Location} from '@angular/common';
import {instance, mock} from 'ts-mockito';
import {SimpleChange, SimpleChanges} from '@angular/core';
import {BarHttpClient} from '../../../../shared/services/httpclient/bar.http.client';
import {SharedModule} from '../../../../shared/shared.module';


describe('Component: FeedetailComponent', () => {
  const createFeeDetailModel = () => {
    const feeDetailModel = new FeeDetailModel();
    feeDetailModel.refund_amount = 0;
    feeDetailModel.amount = 0;
    feeDetailModel.remission_benefiter = '';
    feeDetailModel.refund_amount = 0;
    feeDetailModel.remission_amount = 0;
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
      imports: [FormsModule, SharedModule],
      declarations: [FeeDetailComponent]
    });

    TestBed.overrideComponent(FeeDetailComponent, {
      set: {
        providers: [
          { provide: FeelogService, useClass: FeelogServiceMock },
          { provide: Location, useValue: location },
          {provide: BarHttpClient, useClass: BarHttpClientMock  }
        ]
      }
    });

    fixture = TestBed.createComponent(FeeDetailComponent);
    spyOn(location, 'replaceState').and.callFake(params => {
    });
    component = fixture.componentInstance;
    component.paymentType = { id: 'CARD', name: 'Card' };
    spyOn(component, 'loadFeeCodesAndDescriptions').and.callThrough();
    component.currency = 'GBP';
    component.isVisible = true;
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
    component.ngOnChanges({
      feeDetail: {
        currentValue: createFeeDetailModel(),
        previousValue: {},
        firstChange: true,
        isFirstChange: () => false
      }
    });
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

  it('convertToNumber', () => {
    const value = component.convertToNumber(null);
    expect(value).toBe(0);
    const value2 = component.convertToNumber(1);
    expect(value2).toBe(1);
  });

  it('should have correct fixed feeDetail data', () => {
    const model: FeeSearchModel = new FeeSearchModel();
    const mockData = {
      code: 'X0410',
      fee_type: 'fixed',
      fee_versions: [
        {
          description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.',
          status: 'approved',
          version: 4,
          valid_from: '2016-03-21T00:00:00.000+0000',
          flat_amount: {
            amount: 550
          },
          memo_line: 'GOV - App for divorce/nullity of marriage or CP',
          statutory_instrument: '2016 No. 402 (L. 5)',
          si_ref_id: '1.2',
          natural_account_code: '4481102159',
          fee_order_name: 'The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016',
          direction: 'enhanced'
        }
      ],
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

  it('should have correct ranged feeDetail data', () => {
    const model: FeeSearchModel = new FeeSearchModel();
    const mockData = {
      code: 'X0410',
      fee_type: 'ranged',
      fee_versions: [
        {
          description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.',
          status: 'approved',
          version: 4,
          valid_from: '2016-03-21T00:00:00.000+0000',
          flat_amount: {
            amount: 550
          },
          memo_line: 'GOV - App for divorce/nullity of marriage or CP',
          statutory_instrument: '2016 No. 402 (L. 5)',
          si_ref_id: '1.2',
          natural_account_code: '4481102159',
          fee_order_name: 'The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016',
          direction: 'enhanced'
        }
      ],
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

  it('should have correct feeDetail data when percentage', () => {
    const model: FeeSearchModel = new FeeSearchModel();
    const mockData = {
      code: 'X0410',
      current_version: {
        description: 'Supply published decisions to supplier (each page)',
        volume_amount: { amount: 'calculate' },
        version: '5'
      }
    };

    component.feeDetailCopy = new FeeDetailModel();
    model.assign(mockData);

    component.setCaseReference('12345');
    component.selectFee(model);
    expect(component.selectorVisible).toBeFalsy();
    expect(component.feeDetail.case_reference).toBe('12345');
    expect(component.feeDetail.fee_code).toBe('X0410');
    expect(component.feeDetail.fee_description).toBe('Supply published decisions to supplier (each page)');
    expect(component.feeDetail.amount).toBe(null);
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
    component.searchQuery = '550';
    component.onKeyUpFeeCodesAndDescriptions(e);
    setTimeout(() => {
      expect(component.feeCodesSearch.length).toBe(2);
      expect(component.selectorVisible).toBeTruthy();
      done();
    }, 2000);
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
    expect(caseSelectSection).toBeNull();
  });


  it('should have correct remission amount ', () => {
    component.remission_amount = 20;
    fixture.detectChanges();
    const remissionAmountId = fixture.debugElement.query(By.css('#remission-amount-section'));
    expect(remissionAmountId.nativeElement.className).toContain('form-group');
  });


  it('remission amount must be greater than zero', () => {
    component.remission_amount = 0;
    fixture.detectChanges();
    const remissionAmountId = fixture.debugElement.query(By.css('#remission-amount-section'));
    expect(remissionAmountId.nativeElement.className).toContain('form-group-error');
  });

  it('should have correct remission authorisation', () => {
    component.remission_authorisation = '12345678912';
    fixture.detectChanges();
    const remissionAuthorisationId = fixture.debugElement.query(By.css('#remission-authorisation-section'));
    expect(remissionAuthorisationId.nativeElement.className).toContain('form-group');
  });

  it('remission authorisation must not be empty', () => {
    component.remission_authorisation = '';
    fixture.detectChanges();
    const remissionAuthorisationId = fixture.debugElement.query(By.css('#remission-authorisation-section'));
    expect(remissionAuthorisationId.nativeElement.className).toContain('form-group-error');
  });

  it('remission authorisation must be equal to 11 characters', () => {
    component.remission_authorisation = '12345';
    fixture.detectChanges();
    const remissionAuthorisationId = fixture.debugElement.query(By.css('#remission-authorisation-section'));
    expect(remissionAuthorisationId.nativeElement.className).toContain('form-group-error');
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
    expect(caseSelectSection).toBeNull();
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
    expect(caseSelectSection).toBeNull();
  });

  it('run logic after pressing back button', () => {
    spyOn(component, 'onGoBack').and.callThrough();
    component.isVisible = true;
    component.onPopState({ state: {navigationId: 1} });
    expect(component.onGoBack).toHaveBeenCalledTimes(1);
    component.isVisible = false;
    component.onPopState({ state: {navigationId: 1} });
    expect(component.onGoBack).toHaveBeenCalledTimes(2);
  });

  it('test clicking save button', () => {
    const model = createFeeDetailModel();
    component.feeDetail = model;
    component.type = EditTypes.CREATE;
    const feedetailChange = instance(mock(SimpleChange));
    feedetailChange.currentValue = model;
    feedetailChange.previousValue = {};
    component.ngOnChanges(<SimpleChanges> { feeDetail: feedetailChange });

    spyOn(component.onAmountChange, 'emit').and.callThrough();
    spyOn(component.onCloseComponent, 'emit').and.callThrough();
    spyOn(component, 'validate').and.callFake(() => true);

    component.save();

    expect(component.onCloseComponent.emit).toHaveBeenCalledWith({
      feeDetail: model,
      originalFeeDetail: model,
      editType: EditTypes.CREATE
    });
    expect(component.feeSelectorOn).toBeFalsy();
    expect(component.selectorVisible).toBeFalsy();
  });

  it('toggle jurisdiction', () => {
    component.toggleJurisdiction(component.jurisdictions.list1);
    expect(component.jurisdictions.list1.show).toBeTruthy();
  });

  it('test format fee amount', () => {
    expect(component.formatAmount(320)).toEqual('£320');
    expect(component.formatAmount('320')).toEqual('£320');
    expect(component.formatAmount('calculate')).toEqual('calculate');
    expect(component.formatAmount('')).toEqual('');
  });
});

