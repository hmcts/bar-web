import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPaymentAction} from '../../../core/interfaces/payment-actions';

@Component({
  selector: 'app-action-filter',
  styleUrls: ['./action-filter.component.scss'],
  templateUrl: './action-filter.component.html'
})
export class ActionFilterComponent implements OnInit {
  @Input() actions: IPaymentAction[];
  @Input() selectedAction: IPaymentAction;
  @Output() onActionSelect: EventEmitter<IPaymentAction> = new EventEmitter<IPaymentAction>();

  ngOnInit() {
    this.actions = [];
  }

  onActionClick(action: IPaymentAction): void {
    if (!action.disabled) {
      this.onActionSelect.emit(action);
    }
  }
}
