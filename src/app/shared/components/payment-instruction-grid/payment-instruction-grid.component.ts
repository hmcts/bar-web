import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentInstructionModel } from 'src/app/core/models/paymentinstruction.model';

@Component({
  selector: 'app-payment-instruction-grid',
  styleUrls: ['./payment-instruction-grid.component.scss'],
  templateUrl: './payment-instruction-grid.component.html'
})
export class PaymentInstructionGridComponent implements OnChanges, OnInit {
  @Input() models: PaymentInstructionModel[];
  toggleAll = false;
  totalAmount = 0;

  ngOnInit() {
    this.models = [];
    this.totalAmount = this.calculateAmount();
  }

  ngOnChanges() {
    this.totalAmount = this.calculateAmount();
  }

  calculateAmount() {
    return (this.models)
      ? this.models.reduce((acc, curr) => curr.amount + acc, 0)
      : 0;
  }
  // events ------------------------------- -------------------------------
  onSelectAll() {
    this.models = this.models.map((model: PaymentInstructionModel) => {
      model.selected = !model.selected;
      return model;
    });
  }

  onSubmission() {
  }

  onToggleChecked(model: PaymentInstructionModel) {
    model.selected = !model.selected;
    this.toggleAll = this.models.every((paymentInstructionModel: PaymentInstructionModel) => {
      return paymentInstructionModel.selected === true;
    });
  }
}
