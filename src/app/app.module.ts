import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { UserService } from './services/user/user.service';
import { NavigationTrackerService } from './services/navigationtracker/navigation-tracker.service';
import { SearchService } from './services/search/search.service';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

import { NavigationComponent } from './components/navigation/navigation.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
import { PaymentslogComponent } from './components/paymentslog/paymentslog.component';
import { ModalComponent } from './components/modal/modal.component';
import { UpperCaseFirstPipe } from './pipes/upper-case-first.pipe';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { FeelogComponent } from './components/feelog/feelog.component';
import { FeelogeditComponent } from './components/feelogedit/feelogedit.component';
import { HmctsModalComponent } from './components/hmcts-modal/hmcts-modal.component';
import { UtilService } from './services/util/util.service';
import { PaymentstateService } from './state/paymentstate.service';
import { CheckSubmitComponent } from './components/check-submit/check-submit.component';
import { PaymentOverviewComponent } from './components/payment-overview/payment-overview.component';
import { PaymentReviewComponent } from './components/payment-review/payment-review.component';
import { ApprovedPaymentsComponent } from './components/approved-payments/approved-payments.component';
import { ReportingComponent } from './components/reporting/reporting.component';

const AppRoutes: Routes = [
  { path: 'approved-payments', component: ApprovedPaymentsComponent },
  { path: 'dashboard/payment/edit/:id', component: DashboardComponent },
  { path: 'feelog/edit/:id/change-payment', component: DashboardComponent },
  { path: 'feelog/edit/:id', component: FeelogeditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'paymentslog', component: PaymentslogComponent },
  { path: 'payment-overview', component: PaymentOverviewComponent },
  { path: 'payment-review', component: PaymentReviewComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'check-and-submit', component: CheckSubmitComponent },
  { path: 'feelog', component: FeelogComponent },
  { path: 'reporting', component: ReportingComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    DashboardComponent,
    LoginComponent,
    NavigationComponent,
    PhaseBannerComponent,
    PaymentslogComponent,
    ModalComponent,
    UpperCaseFirstPipe,
    NumbersOnlyDirective,
    FeelogComponent,
    FeelogeditComponent,
    HmctsModalComponent,
    CheckSubmitComponent,
    PaymentOverviewComponent,
    PaymentReviewComponent,
    ApprovedPaymentsComponent,
    ReportingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, {
      // enableTracing: true
    })
  ],
  providers: [NavigationTrackerService, PaymentstateService, SearchService, UserService, UtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
