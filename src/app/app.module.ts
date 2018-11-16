import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {SharedModule} from './shared/shared.module';
import {RoutesModule} from './routes/routes.module';

import {AppComponent} from './app.component';

import {SearchService} from './core/services/search/search.service';
import {UserService} from './shared/services/user/user.service';
import {NavigationTrackerService} from './shared/services/navigationtracker/navigation-tracker.service';
import {UpperCaseFirstPipe} from './core/pipes/upper-case-first.pipe';
import {PaymentStateService} from './shared/services/state/paymentstate.service';
import {UtilService} from './shared/services/util/util.service';
import {ApprovedPaymentsComponent} from './core/components/approved-payments/approved-payments.component';
import {CheckSubmitComponent} from './core/components/check-submit/check-submit.component';
import {PaymentInstructionComponent} from './core/components/payment-instruction/payment-instruction.component';
import {PaymentInstructionListComponent} from './core/components/payment-instruction-list/payment-instruction-list.component';
import {FeelogeditComponent} from './core/components/feelogedit/feelogedit.component';
import {LoginComponent} from './core/components/login/login.component';
import {NavigationComponent} from './shared/components/navigation/navigation.component';
import {PaymentslogComponent} from './core/components/paymentslog/paymentslog.component';
import {PaymentOverviewComponent} from './core/components/payment-overview/payment-overview.component';
import {PaymentReviewComponent} from './core/components/payment-review/payment-review.component';
import {ReportingComponent} from './core/components/reporting/reporting.component';
import {PhaseBannerComponent} from './shared/components/phase-banner/phase-banner.component';
import {ModalComponent} from './core/components/modal/modal.component';
import {HmctsModalComponent} from './shared/components/hmcts-modal/hmcts-modal.component';
import {LoginFormComponent} from './core/components/login-form/login-form.component';
import {CurrencyConverterInterceptor} from './shared/services/interceptors/currency.converter.interceptor';
import {FormatPound} from './shared/pipes/format-pound.pipe';
import {CookieService} from 'ngx-cookie-service';
import {AuthDevInterceptor} from './shared/services/interceptors/auth.dev.interceptor';
import {environment} from '../environments/environment';
import {RoleGuardService} from './shared/services/auth/role-guard.service';
import {AuthService} from './shared/services/auth/auth.service';
import {ErrorComponent} from './core/components/error/error.component';
import {FeeDetailComponent} from './core/components/feelogedit/detail/feedetail.component';
import {FeelogMainComponent} from './core/components/feelogedit/main/feelog.main.component';
import {SearchResultsComponent} from './core/components/search-results/search-results.component';
import {VisibilityDirective} from './shared/directives/visibility/visibility.directive';
import {FeatureEditComponent} from './core/components/feature/feature.edit.component';
import {BarHttpClient} from './shared/services/httpclient/bar.http.client';
import {PaymentReviewSummaryComponent} from './core/components/payment-review-summary/payment-review-summary.component';
import {PaymenttypeService} from './core/services/paymenttype/paymenttype.service';
import { MonitoringService } from './shared/services/appinsights/monitoring.service';

const nonProductionProviders = [{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthDevInterceptor,
  multi: true
}];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RoutesModule,
    SharedModule
  ],
  declarations: [
    UpperCaseFirstPipe,
    AppComponent,
    ApprovedPaymentsComponent,
    CheckSubmitComponent,
    PaymentInstructionComponent,
    PaymentInstructionListComponent,
    FeelogeditComponent,
    FeeDetailComponent,
    FeelogMainComponent,
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
    SearchResultsComponent,
    FormatPound,
    ErrorComponent,
    VisibilityDirective,
    FeatureEditComponent,
    PaymentReviewSummaryComponent
  ],
  providers: [
    AuthService,
    BarHttpClient,
    CookieService,
    NavigationTrackerService,
    PaymentStateService,
    PaymenttypeService,
    RoleGuardService,
    SearchService,
    UserService,
    UtilService,
    MonitoringService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CurrencyConverterInterceptor,
      multi: true
    },
    !environment.production ? nonProductionProviders : [],
    { provide: LOCALE_ID, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
