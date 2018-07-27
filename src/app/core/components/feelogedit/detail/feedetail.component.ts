import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { PaymentslogService } from '../../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../services/paymenttype/paymenttype.service';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { UtilService } from '../../../../shared/services/util/util.service';
import { FeeSearchModel } from '../../../models/feesearch.model';
import { FeeDetailEventMessage, EditTypes, UnallocatedAmountEventMessage } from './feedetail.event.message';
import * as _ from 'lodash';
import { FeeDetailValidator } from './feedatail.validator';

@Component({
  selector: 'app-feedetail',
  templateUrl: './feedetail.component.html',
  providers: [FeelogService, PaymentslogService, PaymenttypeService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeeDetailComponent implements OnInit, OnChanges {
  @Input() type: EditTypes;
  @Input() isVisible: boolean;
  @Input() feeDetail: FeeDetailModel;
  @Input() currency: string;
  @Input() isRefundEnabled: boolean;
  @Input() previousCases: Array<string>;
  @Output() onCloseComponent = new EventEmitter<FeeDetailEventMessage> ();
  @Output() onAmountChange = new EventEmitter<UnallocatedAmountEventMessage> ();

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

  constructor(private feeLogService: FeelogService) {
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
      if (!this.feeDetail.fee_code) {
        this.feeSelectorOn = true;
      }
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

  onKeyUpFeeCodesAndDescriptions($ev) {
    $ev.preventDefault();
    if (this.searchQuery.trim().length < 1) {
      this.feeCodesSearch = [];
      this.selectorVisible = false;
      return;
    }
    this.selectorVisible = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.loadFeeCodesAndDescriptions.bind(this), 600);
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
  }

  cancel() {
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetailCopy,
      originalFeeDetail: this.feeDetailCopy,
      editType: EditTypes.UPDATE
    });
    window.scrollTo(0, 0);
    this.resetForm();
  }

  save() {
    if (!this.validate()) {
      return;
    }
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetail,
      originalFeeDetail: this.feeDetailCopy,
      editType: this.type
    });
    window.scrollTo(0, 0);
    this.resetForm();
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
}

