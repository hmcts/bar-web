import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentslogService } from '../../../core/services/paymentslog/paymentslog.service';
import { PaymenttypeService } from '../../../core/services/paymenttype/paymenttype.service';
import { SearchModel } from '../../../core/models/search.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  providers: [PaymentslogService, PaymenttypeService],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  userId: string;
  status: string;
  paymentType: string;
  piIds: string;

  constructor(
    private _paymentsLogService: PaymentslogService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _location: Location) {
  }

  ngOnInit() {
    combineLatest(this._route.params, this._route.queryParams, (params, qparams) => ({ params, qparams }))
      .subscribe(val => {
        if (val.params && val.params.id) {
          this.userId = val.params.id;
          this.status = val.qparams.status;
          this.paymentType = val.qparams.paymentType;
          this.piIds = val.qparams.piIds;
          this.loadPaymentInstructions();
        }
      });
  }

  loadPaymentInstructions() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.id = this.userId;
    searchModel.status = this.status;
    searchModel.paymentType = this.paymentType;

  }

  goBack() {
    return this._location.back();
  }
}
