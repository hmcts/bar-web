import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "./components/card/card.component";
import { BarHttpClient } from "./services/httpclient/bar.http.client";

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  providers: [BarHttpClient],
  exports: [CardComponent]
})
export class SharedModule {}
