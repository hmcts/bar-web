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
import { PaymentInstructionsComponent } from './components/payment-instructions/payment-instructions.component';

const appRoutes: Routes = [
  { path: 'instructions', component: PaymentInstructionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'paymentslog', component: PaymentslogComponent },
  { path: 'dashboard', component: DashboardComponent },
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
    PaymentInstructionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {
      // enableTracing: true
    })
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
