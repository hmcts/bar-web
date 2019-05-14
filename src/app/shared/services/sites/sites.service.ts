import { Injectable} from '@angular/core';
import {BehaviorSubject, Observable,  Subject,  of} from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user/user.service';

@Injectable()
export class SitesService {
  private sites: Observable<SitesModel[]>;
  private currentSite$: BehaviorSubject<SitesModel>;

  constructor(private http: BarHttpClient, private cookieService: CookieService, private userService: UserService) {
    this.currentSite$ = new BehaviorSubject<SitesModel>(new SitesModel());
  }

  getSites(): Observable<SitesModel[]> {
    if (this.sites) {
      return this.sites;
    }
    this.sites = this.http.get(`/api/sites/users/${this.userService.getUser().email}`);
    return this.sites;
  }

  getCurrentSite$(): Observable<SitesModel> {
    this.getSites().subscribe(result => {
      let data: SitesModel;
      if (this.cookieService.get(UserService.SITEID_COOKIE)) {
        data = result.find(site => site.id === this.cookieService.get(UserService.SITEID_COOKIE));
      }
      if (!data) {
        data = result[0];
      }
      this.currentSite$.next(data);
    });
    return this.currentSite$;
  }

  setCurrentSite(site: SitesModel) {
    this.cookieService.set(UserService.SITEID_COOKIE, site.id);
    this.currentSite$.next(site);
  }
}
