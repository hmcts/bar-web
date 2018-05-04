import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { PaymentslogService } from '../../../services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../services/paymenttype/paymenttype.service';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { UtilService } from '../../../../shared/services/util/util.service';
import { FeeSearchModel } from '../../../models/feesearch.model';
import { FeeDetailEventMessage, EditTypes, UnallocatedAmountEventMessage } from './feedetail.event.message';
import * as _ from 'lodash';

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
  searchFeeModel = '';
  selectorVisible = false;
  feeDetailCopy: FeeDetailModel;
  isRemissionVisible = false;
  isRefundVisible = false;
  caseSelectorOn = false;
  feeSelectorOn = false;
  unallocatedAmount = 0;

  constructor(private feeLogService: FeelogService) {}

  ngOnInit(): void {
    this.loadFeeCodesAndDescriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feeDetail) {
      this.feeDetailCopy = _.cloneDeep(changes.feeDetail.currentValue);
      if (this.feeDetail.remission_amount) {
        this.isRemissionVisible = true;
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
      this.resetRemission();
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
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchFeeModel));
    if (err) {
      console.log('Cannot perform fetch');
      return;
    }

    if (data.found) {
      if (data.fees.length > 0) {
        this.feeCodes = data.fees.map(fee => {
          const feeSearchModel: FeeSearchModel = new FeeSearchModel();
          feeSearchModel.assign( fee );
          return feeSearchModel;
        });
      }
    }
  }

  onKeyUpFeeCodesAndDescriptions($ev) {
    $ev.preventDefault();
    if (this.searchFeeModel.trim().length < 1) {
      this.feeCodesSearch = [];
      this.selectorVisible = false;
      return;
    }
    this.selectorVisible = true;
    this.feeCodesSearch = this.feeCodes.filter(feeCode => {
      const feeCodeString = feeCode.code.toLowerCase();
      return (feeCodeString.includes(this.searchFeeModel.toLowerCase()));
    });
  }

  selectFee(feeCodeModel: FeeSearchModel) {
    this.selectorVisible = false;
    this.feeDetail.fee_code = feeCodeModel.code;
    this.feeDetail.fee_description = feeCodeModel.current_version.description;
    this.feeDetail.amount = feeCodeModel.getAmount();
    this.feeDetail.fee_version = feeCodeModel.current_version.version;
    this.searchFeeModel = '';
    this.feeSelectorOn = false;
    this.recalcUnallocatedAmount();
  }

  cancel() {
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetailCopy,
      originalFeeDetail: this.feeDetailCopy,
      isDirty: false,
      editType: EditTypes.UPDATE
    });
    window.scrollTo(0, 0);
    this.resetForm();
  }

  save() {
    this.onAmountChange.emit(new UnallocatedAmountEventMessage(0, 0, 0));
    this.onCloseComponent.emit({
      feeDetail: this.feeDetail,
      originalFeeDetail: this.feeDetailCopy,
      isDirty: !this.feeDetail.equals(this.feeDetailCopy),
      editType: this.type
    });
    window.scrollTo(0, 0);
    this.resetForm();
  }

  resetForm() {
    this.feeCodesSearch  = [];
    this.feeDetail = new FeeDetailModel();
    this.searchFeeModel = '';
    this.selectorVisible = false;
    this.feeDetailCopy = null;
    this.isRemissionVisible = false;
    this.isRefundVisible = false;
    this.caseSelectorOn = false;
    this.unallocatedAmount = 0;
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
}

