import {Component, Input, OnInit} from '@angular/core';
import {CheckAndSubmit} from '../../../core/models/check-and-submit';
import {Observable} from 'rxjs/internal/Observable';

@Component({
  selector: 'app-payment-instruction-grid',
  styleUrls: ['./payment-instruction-grid.component.scss'],
  templateUrl: './payment-instruction-grid.component.html'
})
export class PaymentInstructionGridComponent implements OnInit {
  @Input() models: CheckAndSubmit[];
  toggleAll$: Observable<boolean>;

  ngOnInit() {
    console.log('Hello world.');
    this.models = [];
  }
  // events ------------------------------- -------------------------------
  onSelectAll() {}
  onSubmission() {}
  onToggleChecked(model: CheckAndSubmit) {}
}


/*

 */
