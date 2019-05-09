import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Injectable()
export class SitesService {
  private sites: Observable<SitesModel[]>;

  constructor(private http: BarHttpClient) {}

  getSites(email: string): Observable<SitesModel[]> {
    if (this.sites) {
      return this.sites;
    }
    this.sites = this.http.get(`/api/sites/users/${email}`);
    return this.sites;
  }
}
