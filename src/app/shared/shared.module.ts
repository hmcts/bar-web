import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  exports: [CardComponent]
})
export class SharedModule { }
