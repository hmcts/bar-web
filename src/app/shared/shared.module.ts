import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { StatsComponent } from './components/stats/stats.component';
import { DetailsComponent } from './components/details/details.component';
import { FormsModule } from '@angular/forms';
import { BarHttpClient } from './services/httpclient/bar.http.client';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [CardComponent, DetailsComponent, StatsComponent],
  exports: [CardComponent, DetailsComponent, StatsComponent],
  providers: [BarHttpClient]
})
export class SharedModule {}
