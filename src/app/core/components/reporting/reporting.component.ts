import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  providers: [PaymentslogService]
})
export class ReportingComponent implements OnInit {
  startDate = moment();

  constructor(private _paymentsLog: PaymentslogService) {
  }

  ngOnInit() {
  }

  generateReportingUrl() {
    if (this.startDate) {
      const downloadUrl = [`/api/payment-instructions?format=csv`];
      downloadUrl.push(`startDate=${moment(this.startDate).format('DDMMYYYY')}`);
      return downloadUrl.join('&');
    } else {
      const url = window.location.href;
      const idx = url.indexOf('#');
      return url.substring(0, idx > -1 ? idx : url.length) + '#';
    }
  }

}
