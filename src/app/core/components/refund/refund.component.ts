import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  providers: [],
  styleUrls: ['./refund.component.css']
})

export class RefundComponent {

  static ADD_REFUND_TEXT = 'Add refund';
  static REMOVE_REFUND_TEXT = 'Remove refund';


  @Input() unallocated: number;
  @Output() updateRefund: EventEmitter<number> = new EventEmitter<number>();

  buttonText: string;
  refundAmount: number;
  enabled: boolean;

  isButtonDisabled(): boolean {
    // return !this.enabled || this.unallocated < 0;
    return false;
  }

  refundButtonClicked(event): void {
    if (event.target.checked) {
      this.buttonText = RefundComponent.REMOVE_REFUND_TEXT;
      if (this.refundAmount <= 0) {
        this.refundAmount = this.unallocated;
      }
    } else {
      this.buttonText = RefundComponent.ADD_REFUND_TEXT;
      this.refundAmount = null;
    }
    this.updateRefund.emit(this.refundAmount);
  }

  onRefundAmountChange(value) {
    this.updateRefund.emit(this.refundAmount);
  }

  resetComponent() {
    this.buttonText = RefundComponent.ADD_REFUND_TEXT;
    this.refundAmount = null;
  }

  initComponent(refundAmount: number, enabled: boolean): void {
    if (refundAmount && enabled) {
      this.buttonText = RefundComponent.REMOVE_REFUND_TEXT;
    } else {
      this.buttonText = RefundComponent.ADD_REFUND_TEXT;
    }
    this.refundAmount = refundAmount != null ? Math.round(refundAmount * 100) / 100 : null;
    this.enabled = enabled;
  }
}
