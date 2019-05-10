import { of, Observable } from 'rxjs';
import { SitesModel } from '../models/sites.model';

export class SitesServiceMock {

  getSites(email: string): Observable<SitesModel[]> {
    return of([{id: 'Y431', description: 'BROMLEY COUNTY COURT', email: []}]);
  }
}
