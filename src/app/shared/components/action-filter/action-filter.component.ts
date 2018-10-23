import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IPaymentAction} from '../../../core/interfaces/payment-actions';

@Component({
  selector: 'app-action-filter',
  styleUrls: ['./action-filter.component.scss'],
  templateUrl: './action-filter.component.html'
})
export class ActionFilterComponent {
  @Input() actions: IPaymentAction[];
  @Output() onActionSelect: EventEmitter<IPaymentAction> = new EventEmitter<IPaymentAction>();

  onActionClick(action: IPaymentAction): void {
    this.onActionSelect.emit(action);
  }
}
