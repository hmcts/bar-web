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

  constructor(private _paymentsLog: PaymentslogService) {
  }

  ngOnInit() {
  }

}
