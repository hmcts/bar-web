import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentsLog } from '../../interfaces/payments-log';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  constructor(
    private _searchService: SearchService
  ) { }

  ngOnInit() {
  }

  get paymentInstructions$(): BehaviorSubject<IPaymentsLog[]> {
    return this._searchService.paymentInstructions$;
  }

}
