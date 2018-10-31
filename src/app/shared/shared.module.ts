import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { StatsComponent } from './components/stats/stats.component';
import { DetailsComponent } from './components/details/details.component';
import { FormsModule } from '@angular/forms';
import { BarHttpClient } from './services/httpclient/bar.http.client';
import { RouterModule } from '@angular/router';
import { ActionFilterComponent } from './components/action-filter/action-filter.component';
import { PaymentInstructionGridComponent } from './components/payment-instruction-grid/payment-instruction-grid.component';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [ActionFilterComponent, PaymentInstructionGridComponent, CardComponent, DetailsComponent, StatsComponent],
  exports: [ActionFilterComponent, PaymentInstructionGridComponent, CardComponent, DetailsComponent, StatsComponent],
  providers: [BarHttpClient]
})
export class SharedModule {}
