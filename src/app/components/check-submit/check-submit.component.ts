import { Component, OnInit } from '@angular/core';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { SearchModel } from '../../models/search.model';
import { UtilService } from '../../services/util/util.service';

@Component({
  selector: 'app-check-submit',
  templateUrl: './check-submit.component.html',
  styleUrls: ['./check-submit.component.css'],
  providers: [PaymentslogService],
})
export class CheckSubmitComponent implements OnInit {
  models: PaymentInstructionModel[];

  constructor(private paymentsLogService: PaymentslogService) { }

  ngOnInit() {
    this.loadPaymentInstructionModels();
  }

  async loadPaymentInstructionModels() {
    const searchModel: SearchModel = new SearchModel();
    searchModel.status = 'V';

    const [err, payments] = await UtilService.toAsync(this.paymentsLogService.searchPaymentsByDate(searchModel));
    console.log( err );
    console.log( payments );
  }

}
