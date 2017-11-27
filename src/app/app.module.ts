import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

import { UserService } from './services/user/user.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
<<<<<<< HEAD
import { PaymentslogComponent } from './components/paymentslog/paymentslog.component';
=======
import { ModalComponent } from './components/modal/modal.component';
>>>>>>> 1d6faeb2b7a157628b3ca82053ffd46a93745ba7

const appRoutes: Routes = [
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
<<<<<<< HEAD
    PaymentslogComponent
=======
    ModalComponent,
>>>>>>> 1d6faeb2b7a157628b3ca82053ffd46a93745ba7
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
