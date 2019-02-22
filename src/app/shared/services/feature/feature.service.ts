import { Injectable } from '@angular/core';
import Feature from '../../models/feature.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BarHttpClient } from '../httpclient/bar.http.client';
import {map} from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class FeatureService {
  private features: Observable<Feature[]>;

  constructor(private http: BarHttpClient, private cacheService: CacheService) {
    this.features = this.getFeatures();
  }

  private getFeatures(): Observable<Feature[]> {
    return this.cacheService.get('features', this.http.get(`/api/features`), 60000);
  }

  public findAllFeatures(): Observable<Feature[]> {
    return this.getFeatures();
  }

  public isFeatureEnabled(uid: string): Observable<boolean> {
    const isEnabled = (features) => {
      const feature = features.find(feat => feat.uid === uid);
        return feature ? feature.enable : false;
    };
    return this.features
      .pipe(
        map(isEnabled)
      );
  }

  public updateFeature(feature: Feature): Observable<any> {
    return this.http.put(`/api/features/${feature.uid}`, feature);
  }

}
