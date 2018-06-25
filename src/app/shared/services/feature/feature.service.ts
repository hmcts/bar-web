import { Injectable } from '@angular/core';
import Feature from '../../models/feature.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class FeatureService {
  private features: Observable<Feature[]>;

  constructor(private http: BarHttpClient) {
    this.features = this.getFeatures();
  }

  private getFeatures(): Observable<Feature[]> {
    return <Observable<Feature[]>>this.http.get(`${environment.apiUrl}/features`);
  }

  public findAllFeatures(): Observable<Feature[]> {
    return this.getFeatures();
  }

  public isFeatureEnabled(uid: string): Observable<boolean> {
    const isEnabled = (features) => {
      const feature = features.find(feat => feat.uid === uid);
        return feature ? feature.enable : false;
    };
    return this.features.map(isEnabled);
  }

  public updateFeature(feature: Feature): Observable<any> {
    return this.http.put(`${environment.apiUrl}/features/${feature.uid}`, feature);
  }
}
