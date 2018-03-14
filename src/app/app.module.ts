import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';

import { AppComponent } from './app.component';

import { SearchService } from './core/services/search/search.service';
import { UserService } from './shared/services/user/user.service';
import { NavigationTrackerService } from './shared/services/navigationtracker/navigation-tracker.service';
import { UpperCaseFirstPipe } from './core/pipes/upper-case-first.pipe';
import { NumbersOnlyDirective } from './core/directives/numbers-only.directive';
import { PaymentstateService } from './shared/services/state/paymentstate.service';
import { UtilService } from './shared/services/util/util.service';
import { CoreModule } from './core/core.module';
import { ApprovedPaymentsComponent } from './core/components/approved-payments/approved-payments.component';
import { CheckSubmitComponent } from './core/components/check-submit/check-submit.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { FeelogComponent } from './core/components/feelog/feelog.component';
import { FeelogeditComponent } from './core/components/feelogedit/feelogedit.component';
import { LoginComponent } from './core/components/login/login.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { PaymentslogComponent } from './core/components/paymentslog/paymentslog.component';
import { PaymentOverviewComponent } from './core/components/payment-overview/payment-overview.component';
import { PaymentReviewComponent } from './core/components/payment-review/payment-review.component';
import { ReportingComponent } from './core/components/reporting/reporting.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';
import { ModalComponent } from './core/components/modal/modal.component';
import { HmctsModalComponent } from './shared/components/hmcts-modal/hmcts-modal.component';
import { LoginFormComponent } from './core/components/login-form/login-form.component';
import { CurrencyConverterInterceptor } from './shared/services/interceptors/currency.converter.interceptor';
import { FormatPound } from './shared/pipes/format-pound.pipe';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RoutesModule,
    SharedModule
  ],
  declarations: [
    NumbersOnlyDirective,
    UpperCaseFirstPipe,

    AppComponent,
    ApprovedPaymentsComponent,
    CheckSubmitComponent,
    DashboardComponent,
    FeelogComponent,
    FeelogeditComponent,
    HmctsModalComponent,
    LoginComponent,
    LoginFormComponent,
    ModalComponent,
    NavigationComponent,
    PaymentslogComponent,
    PaymentOverviewComponent,
    PaymentReviewComponent,
    PhaseBannerComponent,
    ReportingComponent,
    FormatPound
  ],
  providers: [NavigationTrackerService, PaymentstateService, SearchService, UserService, UtilService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CurrencyConverterInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
