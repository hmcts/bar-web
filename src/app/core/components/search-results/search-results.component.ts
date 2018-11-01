import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentTypeEnum } from '../../models/payment.type.enum';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  paymentTypeEnum = new PaymentTypeEnum();
  paymentInstructions: IPaymentsLog[] = [];

  constructor(
    private _searchService: SearchService,
    private _paymentStateService: PaymentStateService
  ) { }

  ngOnInit(): void {
    this._searchService.currentpaymentInstructionsList.subscribe(paymentInstructions => this.paymentInstructions = paymentInstructions);
  }

  get paymentInstructions$(): BehaviorSubject<IPaymentsLog[]> {
    return this._searchService.paymentInstructions$;
  }

}
