import { Injectable } from '@angular/core';
import Feature from '../../models/feature.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FeatureService {
  private features: Promise<Feature[]>;

  constructor(private http: HttpClient) {
    this.features = this.getFeatures();
  }

  private getFeatures(): Promise<Feature[]> {
    return this.http.get(`${environment.apiUrl}/features`)
      .toPromise()
      .then((results: Array<Feature>) => results);
  }

  public findAllFeatures(): Promise<Feature[]> {
    return this.getFeatures();
  }

  public isFeatureEnabled(uid: string): Promise<boolean> {
    return this.features
      .then(features => {
        const feature = features.find(feat => feat.uid === uid);
        return feature ? feature.enable : false;
      });
  }

  public updateFeature(feature: Feature): Promise<any> {
    return this.http.put(`${environment.apiUrl}/features/${feature.uid}`, feature).toPromise();
  }
}
