import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  providers: [PaymentslogService]
})
export class ReportingComponent implements OnInit {
  downloadUrl = environment.apiUrl;
  startDate = '';

  constructor(private _paymentsLog: PaymentslogService) {
  }

  ngOnInit() {
  }

  generateReportingUrl() {
    const downloadUrl = [`${this.downloadUrl}/payment-instructions?format=csv`];
    if (this.startDate.length) {
      downloadUrl.push(`startDate=${this.startDate}`);
    }

    return downloadUrl.join('&');
  }

}
