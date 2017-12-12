import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { UserService } from './services/user/user.service';

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

const AppRoutes: Routes = [
  { path: 'dashboard/payment/edit/:id', component: DashboardComponent },
  { path: 'feelog/edit/:id', component: FeelogeditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'paymentslog', component: PaymentslogComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feelog', component: FeelogComponent },
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
    FeelogeditComponent
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
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
