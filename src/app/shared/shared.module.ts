import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { StatsComponent } from './components/stats/stats.component';
import { DetailsComponent } from './components/details/details.component';
import { FormsModule } from '@angular/forms';
import { BarHttpClient } from './services/httpclient/bar.http.client';
import { RouterModule } from '@angular/router';
import { ActionFilterComponent } from './components/action-filter/action-filter.component';
import { PaymentInstructionGridComponent } from './components/payment-instruction-grid/payment-instruction-grid.component';
import { NumbersOnlyDirective } from './directives/numbers-only/numbers-only.directive';
import { PaymentInstructionResolver } from './resolvers/payment-instruction.resolver';
import { PaymentslogService } from '../core/services/paymentslog/paymentslog.service';
import { FeatureService } from './services/feature/feature.service';
import { FormatPound } from './pipes/format-pound.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    ActionFilterComponent,
    CardComponent,
    DetailsComponent,
    PaymentInstructionGridComponent,
    StatsComponent,
    NumbersOnlyDirective,
    FormatPound
  ],
  exports: [
    ActionFilterComponent,
    CardComponent,
    DetailsComponent,
    PaymentInstructionGridComponent,
    StatsComponent,
    NumbersOnlyDirective,
    FormatPound
  ],
  providers: [
    CurrencyPipe,
    BarHttpClient,
    FeatureService,
    PaymentslogService,

    // resolvers come here
    PaymentInstructionResolver,
  ]
})
export class SharedModule {}
