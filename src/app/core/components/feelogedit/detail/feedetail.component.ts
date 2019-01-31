import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FeelogService } from '../../../services/feelog/feelog.service';
import { FeeDetailModel } from '../../../models/feedetail.model';
import { UtilService } from '../../../../shared/services/util/util.service';
import { FeeSearchModel } from '../../../models/feesearch.model';
import { FeeDetailEventMessage, EditTypes, UnallocatedAmountEventMessage } from './feedetail.event.message';
import * as _ from 'lodash';
import { FeeDetailValidator } from './feedatail.validator';
import { Location } from '@angular/common';
import { IPaymentType } from '../../../interfaces/payment-types';
import { PaymentType } from '../../../../shared/models/util/model.utils';
const { isNumeric } = require('validator');

@Component({
  selector: 'app-feedetail',
  templateUrl: './feedetail.component.html',
  providers: [FeelogService],
  styleUrls: ['../feelogedit.component.scss']
})
export class FeeDetailComponent implements OnInit, OnChanges {
  @Input() paymentType: IPaymentType;
  @Input() type: EditTypes;
  @Input() isVisible: boolean;
  @Input() feeDetail: FeeDetailModel;
  @Input() currency: string;
  @Input() isRefundEnabled: boolean;
  @Input() previousCases: Array<string>;
  @Input() jurisdictions = {
    list1: {
      show: false,
      data: []
    },
    list2: {
      show: false,
      data: []
    }
  };
  @Output() onCloseComponent = new EventEmitter<FeeDetailEventMessage>();
  @Output() onFeeDetailCancel = new EventEmitter();
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
  jurisdiction1: string;
  jurisdiction2: string;
  jurisdiction1Target: any;
  jurisdiction2Target: any;
  timout: any;

  constructor(private feeLogService: FeelogService, private _location: Location) {
    this.feeDetail = new FeeDetailModel();
  }

  get remissionAmount() {
    return this.feeDetail.remission_amount;
  }

  set remissionAmount(amount: number) {
    this.feeDetail.remission_amount = amount;
    this.recalcUnallocatedAmount();
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
      if (this.jurisdiction1Target) {
        this.jurisdiction1Target.checked = false;
        this.jurisdictions.list1.show = false;
      }

      if (this.jurisdiction2Target) {
        this.jurisdiction2Target.checked = false;
        this.jurisdictions.list2.show = false;
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if ((event.state && event.state.navigationId) || !event.path[0].location.hash) {
      this.onGoBack();
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
    this.remissionAmount = null;
    this.feeDetail.remission_authorisation = null;
    this.feeDetail.remission_benefiter = null;
    this.recalcUnallocatedAmount();
  }

  resetRefund() {
    this.feeDetail.refund_amount = null;
  }

  async loadFeeCodesAndDescriptions() {
    const [err, data] = await UtilService.toAsync(this.feeLogService.getFeeCodesAndDescriptions(this.searchQuery,
      this.jurisdiction1, this.jurisdiction2));
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
    const length = isNumeric(this.searchQuery) ? 1 : 3;
    if (this.searchQuery.trim().length < length) {
      this.feeCodesSearch = [];
      this.selectorVisible = false;
      return;
    }
    this.selectorVisible = true;
    return new Promise(resolve => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => resolve(this.loadFeeCodesAndDescriptions()), 1000);
    });
  }

  selectFee(feeCodeModel: FeeSearchModel) {
    this.selectorVisible = false;
    this.feeDetail.fee_code = feeCodeModel.code;
    this.feeDetail.fee_description = feeCodeModel.current_version.description;
    this.feeDetail.amount = this.isNumber(feeCodeModel.getAmount()) ? feeCodeModel.getAmount() : null;
    this.feeDetail.fee_version = feeCodeModel.current_version.version;
    this.searchQuery = '';
    this.feeSelectorOn = false;
    this.validator.validateFeeDetailData(this.feeDetail);
    this.feeDetail.feeType = feeCodeModel.fee_type;
    if (this.isFeeAmountEditable(feeCodeModel)) {
      this.feeDetail.showEditableAmount = true;
      this.feeDetail.showFixedAmount = false;
    } else {
      this.feeDetail.showEditableAmount = false;
      this.feeDetail.showFixedAmount = true;
    }
    this.recalcUnallocatedAmount();
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
  }

  cancel() {
    this.onGoBack();
  }

  save() {
    if (!this.validate()) {
      return;
    }
    this.onCloseComponent.emit({
      feeDetail: this.feeDetail,
      originalFeeDetail: this.feeDetailCopy,
      editType: this.type
    });
    this.resetComponent();
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

  set feeDetailAmount(amount) {
    this.feeDetail.amount = amount;
    this.validator.validateFeeAmount(this.feeDetail);
  }

  get feeDetailAmount() {
    return this.feeDetail.amount;
  }

  toggleJurisdiction(jurisdiction) {
    jurisdiction.show = !jurisdiction.show;
  }

  onSelectJurisdiction1Type(event) {
    this.jurisdiction1 = event.target.value;
    this.jurisdiction1Target = event.target;
  }

  onSelectJurisdiction2Type(event) {
    this.jurisdiction2 = event.target.value;
    this.jurisdiction2Target = event.target;
  }

  isNumber(amount: any): boolean {
    if (!amount) {
      return false;
    }
    return !isNaN(amount);
  }

  formatAmount(amount: any) {
    return this.isNumber(amount) ? '£' + amount : amount;
  }

  remissionAndRefundSectionVisible(): boolean {
    return this.paymentType.id !== PaymentType.FULL_REMISSION;
  }

  formatJurisdictionId(jurisdiction: string) {
    return jurisdiction.split(' ').join('_');
  }
}

