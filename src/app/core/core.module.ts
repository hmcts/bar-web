import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RoutesModule } from '../routes/routes.module';
import { PaymentstateService } from '../shared/services/state/paymentstate.service';
import { SearchService } from './services/search/search.service';
import { ApprovedPaymentsComponent } from './components/approved-payments/approved-payments.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CheckSubmitComponent } from './components/check-submit/check-submit.component';
import { FeelogeditComponent } from './components/feelogedit/feelogedit.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentslogComponent } from './components/paymentslog/paymentslog.component';
import { PaymentOverviewComponent } from './components/payment-overview/payment-overview.component';
import { PaymentReviewComponent } from './components/payment-review/payment-review.component';
import { FeelogComponent } from './components/feelog/feelog.component';
import { ReportingComponent } from './components/reporting/reporting.component';

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RoutesModule
  ],
  providers: [PaymentstateService, SearchService],
})
export class CoreModule { }
