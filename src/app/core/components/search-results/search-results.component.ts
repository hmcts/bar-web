import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentStateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentTypeEnum } from '../../models/payment.type.enum';
import { BehaviorSubject } from 'rxjs';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  providers: [PaymentInstructionsService]
})
export class SearchResultsComponent implements OnInit {
  paymentTypeEnum = new PaymentTypeEnum();
  paymentInstructions: IPaymentsLog[] = [];

  constructor(
    private _searchService: SearchService,
    private _paymentInstructionService: PaymentInstructionsService
  ) { }

  ngOnInit(): void {
    this._searchService.currentpaymentInstructionsList.subscribe(paymentInstructions => this.paymentInstructions = paymentInstructions);
  }

  get paymentInstructions$(): BehaviorSubject<IPaymentsLog[]> {
    return this._searchService.paymentInstructions$;
  }

  collectCaseReferences(payment: IPaymentsLog): string[] {
    return payment.case_fee_details.map(fee => fee.case_reference)
                                   .filter((value, index, self) => self.indexOf(value) === index);
  }

}
