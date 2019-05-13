import { Injectable} from '@angular/core';
import {BehaviorSubject, Observable,  Subject,  of} from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user/user.service';

@Injectable()
export class SitesService {
  private sites: Observable<SitesModel[]>;
  private currentSiteSubject: BehaviorSubject<SitesModel>;
  private currentSite$: Observable<SitesModel>;

  constructor(private http: BarHttpClient, private cookieService: CookieService, private userService: UserService) {
    this.currentSiteSubject = new BehaviorSubject<SitesModel>(new SitesModel());
    this.currentSite$ = this.currentSiteSubject.asObservable();
  }

  getSites(): Observable<SitesModel[]> {
    if (this.sites) {
      return this.sites;
    }
    this.sites = this.http.get(`/api/sites/users/${this.userService.getUser().email}`);
    return this.sites;
  }

  getCurrentSite(): Observable<SitesModel> {
    this.getSites().subscribe(result => {
      let data: SitesModel;
      if (this.cookieService.get(UserService.SITEID_COOKIE)) {
        data = result.find(site => site.id === this.cookieService.get(UserService.SITEID_COOKIE));
      }
      if (!data) {
        data = result[0];
      }
      this.currentSiteSubject.next(data);
    });
    return this.currentSiteSubject;
  }

  setCurrentSite(site: SitesModel) {
    this.cookieService.set(UserService.SITEID_COOKIE, site.id);
    this.currentSiteSubject.next(site);
  }
}
