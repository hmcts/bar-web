import { Injectable } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { SitesModel } from 'src/app/core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';

@Injectable()
export class SitesService {
  private sites: Observable<SitesModel[]>;
  constructor(private http: BarHttpClient) {}

  getSites(email: string): Observable<SitesModel[]> {
    if (this.sites) {
      return this.sites;
    }

    this.sites = this.http.get(`/sites/users/${email}`);
    return this.sites;
  }
}
