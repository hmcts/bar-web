import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ApprovedPaymentsComponent } from '../core/components/approved-payments/approved-payments.component';
import { CheckSubmitComponent } from '../core/components/check-submit/check-submit.component';
import { DashboardComponent } from '../core/components/dashboard/dashboard.component';
import { FeelogComponent } from '../core/components/feelog/feelog.component';
import { FeelogeditComponent } from '../core/components/feelogedit/feelogedit.component';
import { LoginComponent } from '../core/components/login/login.component';
import { PaymentslogComponent } from '../core/components/paymentslog/paymentslog.component';
import { PaymentOverviewComponent } from '../core/components/payment-overview/payment-overview.component';
import { PaymentReviewComponent } from '../core/components/payment-review/payment-review.component';
import { ReportingComponent } from '../core/components/reporting/reporting.component';
import { UserService } from '../shared/services/user/user.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginGuard {
  constructor(private _userService: UserService) {
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    if (this._userService.getUser() === null) {
      if (!environment.production) {
        return true;
      }

      window.location.href = '/login';
      return false;
    }

    return true;
  }
}

const AppRoutes: Routes = [
  { path: 'approved-payments', component: ApprovedPaymentsComponent },
  { path: 'dashboard/payment/edit/:id', component: DashboardComponent },
  { path: 'feelog/edit/:id/change-payment', component: DashboardComponent },
  { path: 'feelog/edit/:id', component: FeelogeditComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  { path: 'paymentslog', component: PaymentslogComponent },
  { path: 'payment-overview', component: PaymentOverviewComponent },
  { path: 'payment-review', component: PaymentReviewComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'check-and-submit', component: CheckSubmitComponent },
  { path: 'feelog', component: FeelogComponent },
  { path: 'reporting', component: ReportingComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  providers: [LoginGuard],
  imports: [CommonModule, RouterModule.forRoot(AppRoutes)]
})
export class RoutesModule { }
