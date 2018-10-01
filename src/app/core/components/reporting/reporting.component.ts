import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  providers: [PaymentslogService]
})
export class ReportingComponent implements OnInit {
  startDate = '';

  constructor(private _paymentsLog: PaymentslogService) {
  }

  ngOnInit() {
  }

  generateReportingUrl() {
    const downloadUrl = [`/api/payment-instructions?format=csv`];
    if (this.startDate.length) {
      downloadUrl.push(`startDate=${this.startDate}`);
    }

    return downloadUrl.join('&');
  }

}
