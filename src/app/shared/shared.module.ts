import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { StatsComponent } from './components/stats/stats.component';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent, DetailsComponent, StatsComponent],
  exports: [CardComponent, DetailsComponent, StatsComponent]
})
export class SharedModule { }
