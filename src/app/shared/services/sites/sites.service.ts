import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class SitesService {
  private sites: Observable<SitesModel[]>;

  constructor(private http: BarHttpClient) {}

  // getSites(email: string): Observable<SitesModel[]> {
  //   if (this.sites) {
  //     return this.sites;
  //   }
  //   this.sites = this.http.get(`/api/sites/users/${email}`);
  //   return this.sites;
  // }

  getSites(email: string): Observable<SitesModel[]> {
    return of([{id: 'Y431', description: 'BROMLEY COUNTY COURT', email: []},
    {id: 'SITE2', description: 'SITE2 COUNTY COURT', email: []},
    {id: 'SITE3', description: 'SITE3 COUNTY COURT', email: []}]);
  }
}
