import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RoutesModule } from '../routes/routes.module';
import { PaymentstateService } from '../shared/services/state/paymentstate.service';
import { SearchService } from './services/search/search.service';

@NgModule({
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
