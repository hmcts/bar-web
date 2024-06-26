 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedPaymentsComponent } from '../core/components/approved-payments/approved-payments.component';
import { CheckSubmitComponent } from '../core/components/check-submit/check-submit.component';
import { PaymentInstructionComponent } from '../core/components/payment-instruction/payment-instruction.component';
import { PaymentInstructionListComponent } from '../core/components/payment-instruction-list/payment-instruction-list.component';
import { FeelogeditComponent } from '../core/components/feelogedit/feelogedit.component';
import { LoginComponent } from '../core/components/login/login.component';
import { PaymentslogComponent } from '../core/components/paymentslog/paymentslog.component';
import { PaymentOverviewComponent } from '../core/components/payment-overview/payment-overview.component';
import { PaymentReviewComponent } from '../core/components/payment-review/payment-review.component';
import { ReportingComponent } from '../core/components/reporting/reporting.component';
import { RoleGuardService } from '../shared/services/auth/role-guard.service';
import { ErrorComponent } from '../core/components/error/error.component';
import { roles } from '../shared/services/auth/roles';
import { SearchResultsComponent } from '../core/components/search-results/search-results.component';
import { FeatureEditComponent } from '../core/components/feature/feature.edit.component';
import { PaymentReviewSummaryComponent } from '../core/components/payment-review-summary/payment-review-summary.component';
import { StatsComponent } from '../shared/components/stats/stats.component';
import { DetailsComponent } from '../shared/components/details/details.component';
import { PaymentInstructionResolver } from '../shared/resolvers/payment-instruction.resolver';
import { SiteAdminComponent } from '../core/components/site-admin/site-admin.component';
import { HostBasedGuardService } from '../shared/services/auth/host-based-guard.service';
import { CookiePolicyComponent } from '../core/components/cookie-policy/cookie-policy.component';
import { CookieDetailsComponent } from '../core/components/cookie-details/cookie-details.component';
import { AccessibilityStatementComponent } from '../core/components/accessibility-statement/accessibility-statement.component';

const AppRoutes: Routes = [
  // Dashboard
  { path: 'dashboard',
    component: PaymentInstructionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.postClerk.roleName, roles.feeClerk.roleName]
    }
  },
  { path: 'dashboard/payment/edit/:id',
    component: PaymentInstructionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.postClerk.roleName]
    }
  },
  // Paymentslog
  { path: 'paymentslog',
    component: PaymentslogComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.postClerk.roleName]
    }
  },
  // Feelog
  { path: 'feelog',
    component: PaymentInstructionListComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.feeClerk.roleName]
    }
  },
  {
    path: 'feelog/edit/:id',
    component: FeelogeditComponent,
    canActivate: [RoleGuardService],
    resolve: { paymentInstructionData: PaymentInstructionResolver },
    data: {
      expectedRoles: [roles.feeClerk.roleName, roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'feelog/edit/:id/change-payment',
    component: PaymentInstructionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.feeClerk.roleName]
    }
  },
  // Check and submit
  { path: 'check-and-submit',
    component: CheckSubmitComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.feeClerk.roleName]
    }
  },
  { path: 'payment-overview',
    component: PaymentOverviewComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'users/:id/payment-instructions/stats',
    component: PaymentReviewSummaryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    },
    children: [
      {
        path: 'details',
        component: DetailsComponent
      },
      {
        path: '',
        component: StatsComponent
      }
    ]
  },
  { path: 'users/:id/payment-instructions',
    component: PaymentReviewComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'users/:id/rejected-payment-instructions',
    component: PaymentReviewComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'approved-payments',
    component: ApprovedPaymentsComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'approved-payments',
    component: ApprovedPaymentsComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'reporting',
    component: ReportingComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'search',
    component: SearchResultsComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.postClerk.roleName, roles.feeClerk.roleName, roles.seniorClerk.roleName, roles.deliveryManager.roleName]
    }
  },
  { path: 'features',
    component: FeatureEditComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.deliveryManager.roleName]
    }
  },
  { path: 'user-admin',
    component: SiteAdminComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [roles.deliveryManager.roleName],
      // onlyShowInternal: true
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'reporting', component: ReportingComponent },
  { path: 'cookies', component: CookiePolicyComponent },
  { path: 'cookies-policy', component: CookieDetailsComponent },
  { path: 'accessibility', component: AccessibilityStatementComponent },
  { path: 'error/:errorCode', component: ErrorComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'error/404' }
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [CommonModule, RouterModule.forRoot(AppRoutes)]
})
export class RoutesModule { }
