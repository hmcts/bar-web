import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { UtilService } from '../../../../shared/services/util/util.service';
import { FeeSearchModel } from '../../../models/feesearch.model';
import { FeeDetailEventMessage, EditTypes, UnallocatedAmountEventMessage } from './feedetail.event.message';
import * as _ from 'lodash';
import { FeeDetailValidator } from './feedatail.validator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-feedetail',
  templateUrl: './feedetail.component.html',
  providers: [FeelogService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeeDetailComponent implements OnInit, OnChanges {
  @Input() type: EditTypes;
  @Input() isVisible: boolean;
  @Input() feeDetail: FeeDetailModel;
  @Input() currency: string;
  @Input() isRefundEnabled: boolean;
  @Input() previousCases: Array<string>;
  @Input() jurisdictions: {};
  @Output() onCloseComponent = new EventEmitter<FeeDetailEventMessage>();
  @Output() onAmountChange = new EventEmitter<UnallocatedAmountEventMessage>();

  feeCodes: FeeSearchModel[] = [];
  feeCodesSearch: FeeSearchModel[] = [];
  searchQuery = '';
  selectorVisible = false;
  feeDetailCopy: FeeDetailModel;
  isRemissionVisible = false;
  isRefundVisible = false;
  caseSelectorOn = false;
  feeSelectorOn = false;
  unallocatedAmount = 0;
  timeout: any;
  validator = new FeeDetailValidator();
  _savePressed = false;

  constructor(private feeLogService: FeelogService, private _location: Location) {
    this.feeDetail = new FeeDetailModel();
  }

  ngOnInit(): void {
    this.loadFeeCodesAndDescriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feeDetail) {
      this.feeDetailCopy = _.cloneDeep(changes.feeDetail.currentValue);
      if (this.feeDetail.remission_amount) {
        this.isRemissionVisible = true;
      }
      if (this.feeDetail.fee_code) {
        this.feeSelectorOn = false;
      } else {
        this.feeSelectorOn = true;
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.isVisible && !this._savePressed) {
      this.onGoBack();
    } else if (this.isVisible && this._savePressed) {
      this.onSavePressed();
    }
  }

  getEditTypes() {
    return EditTypes;
  }

  toggleRemission(event) {
    if (event.target.checked) {
      this.isRemissionVisible = true;
    } else {
      this.resetRemission();
      this.isRemissionVisible = false;
    }
  }

  toggleRefund(event) {
    if (event.target.checked) {
      this.isRefundVisible = true;
    } else {
      this.resetRefund();
      this.isRefundVisible = false;
    }
  }

  toggleFeeSelector() {
    this.feeSelectorOn = !this.feeSelectorOn;
  }

  isCaseSelectorIsVisible() {
    return (this.type === EditTypes.CREATE && this.previousCases && this.previousCases.length > 0);
  }

  resetRemission() {
    this.feeDetail.remission_amount = null;
    this.feeDetail.remission_authorisation = null;
    this.feeDetail.remission_benefiter = null;
  }

  resetRefund() {
    this.feeDetail.refund_amount = null;
  }

  async loadFeeCodesAndDescriptions() {
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchQuery));
    if (err) {
      console.log('Cannot perform fetch', err);
      return;
    }

    if (data.found) {
      this.feeCodesSearch = data.fees.map(fee => {
        const feeSearchModel: FeeSearchModel = new FeeSearchModel();
        feeSearchModel.assign( fee );
        return feeSearchModel;
      });
    }
  }

  onKeyUpFeeCodesAndDescriptions($ev): Promise<void> {
    $ev.preventDefault();
    if (this.searchQuery.trim().length < 1) {
      this.feeCodesSearch = [];
      this.selectorVisible = false;
      return;
    }
    this.selectorVisible = true;
    this.loadFeeCodesAndDescriptions();
  }

  selectFee(feeCodeModel: FeeSearchModel) {
    this.selectorVisible = false;
    this.feeDetail.fee_code = feeCodeModel.code;
    this.feeDetail.fee_description = feeCodeModel.current_version.description;
    this.feeDetail.amount = feeCodeModel.getAmount();
    this.feeDetail.fee_version = feeCodeModel.current_version.version;
    this.searchQuery = '';
    this.feeSelectorOn = false;
    this.recalcUnallocatedAmount();
    this.validator.validateFeeDetailData(this.feeDetail);
    this.feeDetail.feeType = feeCodeModel.fee_type;
    if (this.isFeeAmountEditable(feeCodeModel)) {
      this.feeDetail.showEditableAmount = true;
      this.feeDetail.showFixedAmount = false;
    } else {
      this.feeDetail.showEditableAmount = false;
      this.feeDetail.showFixedAmount = true;
    }
  }

  isFeeAmountEditable(feeCodeModel: FeeSearchModel) {
    if (feeCodeModel.fee_type === 'fixed' && feeCodeModel.fee_versions[0].flat_amount !== undefined) {
      return false;
    }
    if (feeCodeModel.fee_type === 'ranged' && feeCodeModel.fee_versions[0].flat_amount !== undefined) {
      return false;
    }
    return true;
  }

  onGoBack() {
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetailCopy,
      originalFeeDetail: this.feeDetailCopy,
      editType: EditTypes.UPDATE
    });
    this.resetComponent();
    this._location.replaceState(this._location.path());
  }

  cancel() {
    this._location.back();
  }

  save() {
    if (!this.validate()) {
      return;
    }
    this._savePressed = true;
    this._location.back();
  }

  onSavePressed() {
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetail,
      originalFeeDetail: this.feeDetailCopy,
      editType: this.type
    });
    this.resetComponent();
    this._location.replaceState(this._location.path());
    this._savePressed = false;
  }

  resetForm() {
    this.feeCodesSearch  = [];
    this.feeDetail = new FeeDetailModel();
    this.searchQuery = '';
    this.selectorVisible = false;
    this.feeDetailCopy = null;
    this.isRemissionVisible = false;
    this.isRefundVisible = false;
    this.caseSelectorOn = false;
    this.unallocatedAmount = 0;
    this.validator = new FeeDetailValidator();
  }

  private resetComponent() {
    window.scrollTo(0, 0);
    this.resetForm();
    this.feeSelectorOn = false;
    this.selectorVisible = false;
  }

  recalcUnallocatedAmount() {
    const delta = new UnallocatedAmountEventMessage(
      this.convertToNumber(this.feeDetail.amount) - this.convertToNumber(this.feeDetailCopy.amount),
      this.convertToNumber(this.feeDetail.remission_amount) - this.convertToNumber(this.feeDetailCopy.remission_amount),
      this.convertToNumber(this.feeDetail.refund_amount) - this.convertToNumber(this.feeDetailCopy.refund_amount)
    );
    this.onAmountChange.emit(delta);
  }

  convertToNumber(value): number {
    return value == null ? 0 : value;
  }

  setCaseReference(caseReference: string) {
    this.feeDetail.case_reference = caseReference;
  }

  validate(): boolean {
    return this.validator.validateAll(this.feeDetail);
  }

  set case_reference(case_reference) {
    this.feeDetail.case_reference = case_reference;
    this.validator.validateCaseReference(this.feeDetail);
  }

  get case_reference() {
    return this.feeDetail.case_reference;
  }

  toggleJurisdiction(jurisdiction) {
    console.log( jurisdiction );
    jurisdiction.show = !jurisdiction.show;
    console.log( jurisdiction );
  }
}

