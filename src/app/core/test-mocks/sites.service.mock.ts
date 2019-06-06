import { of, Observable } from 'rxjs';
import { SitesModel } from '../models/sites.model';

export class SitesServiceMock {

  getSites(): Observable<SitesModel[]> {
    return of([{id: 'Y431', description: 'BROMLEY COUNTY COURT', siteUsers: []}]);
  }

  getCurrentSite$(): Observable<SitesModel> {
   return of({id: 'Y431', description: 'BROMLEY COUNTY COURT', siteUsers: []});
  }

  setCurrentSite(site: SitesModel) {
  }

  getSite(siteId: string): Observable<SitesModel> {
    return of({id: 'Y431', description: 'BROMLEY COUNTY COURT', siteUsers: [
      {'email': 'a@a.com', 'forename': 'A', 'surname': 'User'},
      {'email': 'b@b.com', 'forename': 'B', 'surname': 'User'},
      {'email': 'c@c.com', 'forename': 'C', 'surname': 'User'},
    ]});
  }

  addUserToSite(email: string, siteId: string): Observable<any> {
    return of('');
  }

  removeUserFromSite(email: string, siteId: string): Observable<any> {
    return of('');
  }
}
