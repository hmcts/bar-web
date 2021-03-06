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
  private _startDate = null;
  dateError = '';

  constructor(private _paymentsLog: PaymentslogService) {
  }

  ngOnInit() {
  }

  set startDate(startDate) {
    this._startDate = startDate;
    this.isDateValid(startDate);
  }

  get startDate() {
    return this._startDate;
  }

  isDateValid(startDate: string): boolean {
    if (!startDate) {
      return true;
    }
    const ret = /^\d{4}-\d{2}-\d{2}$/.test(startDate);
    if (!ret) {
      this.dateError = 'Invalid date format';
    } else {
      this.dateError = '';
    }
    return ret;
  }

  generateReportingUrl() {
    if (this.startDate && !this.dateError) {
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
