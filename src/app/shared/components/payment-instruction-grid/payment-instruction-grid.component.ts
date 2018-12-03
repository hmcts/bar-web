import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';

@Component({
  selector: 'app-payment-instruction-grid',
  styleUrls: ['./payment-instruction-grid.component.scss'],
  templateUrl: './payment-instruction-grid.component.html'
})
export class PaymentInstructionGridComponent implements OnChanges, OnInit {
  @Input() models: PaymentInstructionModel[];
  @Output() onFormSubmission: EventEmitter<PaymentInstructionModel[]> = new EventEmitter<PaymentInstructionModel[]>();
  toggleAll = false;
  totalAmount = 0;

  ngOnInit() {
    this.models = [];
    this.totalAmount = this.calculateAmount();
  }

  ngOnChanges() {
    this.totalAmount = this.calculateAmount();
    this.toggleAll = false;
  }

  calculateAmount() {
    return (this.models)
      ? this.models.reduce((acc, curr, index) => {
        const paymentAmount = curr.amount || curr.getProperty('paymentAmount');
        return paymentAmount !== ''
          ? parseFloat(paymentAmount) + acc
          : acc;
      }, 0)
      : 0;
  }

  // events ------------------------------- -------------------------------
  onSelectAll() {
    this.toggleAll = !this.toggleAll;
    this.models = this.models.map((model: PaymentInstructionModel) => {
      model.selected = this.toggleAll;
      return model;
    });
  }

  onSubmission() {
    const models = this.models.filter(model => model.selected);
    this.onFormSubmission.emit(models);
  }

  onToggleChecked(model: PaymentInstructionModel) {
    model.selected = !model.selected;
    this.toggleAll = this.models.every((paymentInstructionModel: PaymentInstructionModel) => {
      return paymentInstructionModel.selected === true;
    });
  }
}
