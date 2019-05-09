import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class SitesService {
  private sites: SitesModel[];
  constructor(private http: BarHttpClient) {}

  getSites(email: string): SitesModel[] {
    if (this.sites) {
      return this.sites;
    }

    this.http.get(`/api/sites/users/${email}`).subscribe(
      result => {
        console.log('sites result=>');
        console.log(result);
        this.sites = result;
      },
      error => {
        console.log('sites error');
        console.log(error);
      }
    );
    return this.sites;
  }
}
