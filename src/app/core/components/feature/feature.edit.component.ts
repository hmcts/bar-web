import { Component } from '@angular/core';
import Feature from '../../../shared/models/feature.model';
import { FeatureService } from '../../../shared/services/feature/feature.service';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature.edit.component.html',
  providers: [FeatureService],
  styleUrls: ['./feature.edit.component.scss']
})

export class FeatureEditComponent {
  features: Feature[];
  constructor(private featureService: FeatureService) {
    this.featureService.findAllFeatures().subscribe(features => {
      this.features = features;
    });
  }

  sendFeatureUpdate() {
    this.features.forEach(element => {
      this.featureService.updateFeature(element).subscribe(resp => {
        console.log(resp);
      });
    });
  }
}
