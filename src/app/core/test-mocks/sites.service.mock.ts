import { of, Observable } from 'rxjs';
import { SitesModel } from '../models/sites.model';

export class SitesServiceMock {

  getSites(): Observable<SitesModel[]> {
    return of([{id: 'Y431', description: 'BROMLEY COUNTY COURT', emails: []}]);
  }

  getCurrentSite$(): Observable<SitesModel> {
   return of({id: 'Y431', description: 'BROMLEY COUNTY COURT', emails: []});
  }

  setCurrentSite(site: SitesModel) {
  }

  getSite(siteId: string): Observable<SitesModel> {
    return of({id: 'Y431', description: 'BROMLEY COUNTY COURT', emails: ['a@a', 'b@b', 'c@c']});
  }

  addUserToSite(email: string, siteId: string): Observable<any> {
    return of('');
  }

  removeUserFromSite(email: string, siteId: string): Observable<any> {
    return of('');
  }
}
