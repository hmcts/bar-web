import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { PaymentInstructionModel } from '../../../core/models/paymentinstruction.model';
import { ICheckAndSubmit } from '../../../core/interfaces/check-and-submit';
import { PaymentType } from '../../models/util/model.utils';

@Component({
  selector: 'app-payment-instruction-grid',
  styleUrls: ['./payment-instruction-grid.component.scss'],
  templateUrl: './payment-instruction-grid.component.html',
})
export class PaymentInstructionGridComponent implements OnChanges, OnInit {
  private _models: ICheckAndSubmit[] = [];

  get models() {
    return this._models;
  }

  // We display the the fee value in the remission column for full remission
  @Input('models')
  set models(models: ICheckAndSubmit[]) {
    if (models) {
      this._models = models.map((model, idx) => {
        if (model.paymentType && model.paymentType.id === PaymentType.FULL_REMISSION) {
          model.remission = model.fee;
        }
        const nextModel = models[idx + 1];
        model.separatorNeeded = nextModel && !!nextModel.paymentId;
        return model;
      });
    }
  }

  @Output() onFormSubmission: EventEmitter<ICheckAndSubmit[]> = new EventEmitter<ICheckAndSubmit[]>();
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
    return (this.models) ? this.models.reduce((acc, curr) => (curr.paymentAmount + acc), 0) : 0;
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

  onToggleChecked(model: ICheckAndSubmit) {
    model.selected = !model.selected;
    this.toggleAll = this.models.every((paymentInstructionModel: ICheckAndSubmit) => {
      return paymentInstructionModel.selected === true;
    });
  }
}
