import { Observable } from 'rxjs/Observable';
import Feature from '../../shared/models/feature.model';
import { of } from 'rxjs/observable/of';

export class FeatureServiceMock {
  findAllFeatures(): Observable<Feature[]> {
    return of([]);
  }

  isFeatureEnabled(uid: string): Observable<boolean> {
    return of(true);
  }

  updateFeature(feature: Feature): Observable<any> {
    return of({ success: true, data: {} });
  }
}
