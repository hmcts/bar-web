import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {IPaymentAction} from '../../../core/interfaces/payment-actions';
import { IPaymentStatistics } from '../../../core/interfaces/payment.statistics';

@Component({
  selector: 'app-action-filter',
  styleUrls: ['./action-filter.component.scss'],
  templateUrl: './action-filter.component.html'
})
export class ActionFilterComponent implements OnChanges {
  @Input() actionStats: any;
  @Input() actions: IPaymentAction[];
  @Input() selectedAction: IPaymentAction;
  @Output() onActionSelect: EventEmitter<IPaymentAction> = new EventEmitter<IPaymentAction>();

  numOfPaymentInstructions = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.actionStats && changes.actionStats.currentValue) {
      this.processData(changes.actionStats.currentValue);
    }
  }

  onActionClick(action: IPaymentAction): void {
    if (!action.disabled) {
      this.onActionSelect.emit(action);
    }
  }

  findActionCount(action: string): number {
    return this.numOfPaymentInstructions[action] ? this.numOfPaymentInstructions[action] : 0;
  }

  private processData(actionStats) {
    this.numOfPaymentInstructions = {};
    Object.keys(actionStats).forEach(key => actionStats[key].forEach(element => {
      const stat = <IPaymentStatistics> element;
      if (this.numOfPaymentInstructions[stat.action]) {
        this.numOfPaymentInstructions[stat.action] += stat.count;
      } else {
        this.numOfPaymentInstructions[stat.action] = stat.count;
      }
    }));
  }
}
