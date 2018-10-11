import { Observable } from 'rxjs';
import Feature from '../../shared/models/feature.model';
import {of} from 'rxjs/internal/observable/of';

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
