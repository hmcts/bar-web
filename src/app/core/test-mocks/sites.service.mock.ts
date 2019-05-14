import { of, Observable } from 'rxjs';
import { SitesModel } from '../models/sites.model';

export class SitesServiceMock {

  getSites(): Observable<SitesModel[]> {
    return of([{id: 'Y431', description: 'BROMLEY COUNTY COURT', emails: []}]);
  }

  getCurrentSite(): Observable<SitesModel> {
   return of({id: 'Y431', description: 'BROMLEY COUNTY COURT', emails: []});
  }

  setCurrentSite(site: SitesModel) {
  }
}
