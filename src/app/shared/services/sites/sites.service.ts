import { Injectable} from '@angular/core';
import {BehaviorSubject, Observable,  Subject,  of} from 'rxjs';
import { SitesModel } from '../../../core/models/sites.model';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SitesService {
  private sites$: Observable<SitesModel[]>;
  private currentSiteSubject = new BehaviorSubject<SitesModel>(new SitesModel());
  private site$: Observable<SitesModel>;

  constructor(private http: BarHttpClient, private cookieService: CookieService, private userService: UserService) { }

  getSites(): Observable<SitesModel[]> {
    if (this.sites$) {
      return this.sites$;
    }
    const user = this.userService.getUser();
    if (user && user.email) {
      this.sites$ = this.http.get('/api/sites?my-sites=true');
      this.sites$.subscribe(result => {
        let data: SitesModel;
        if (this.cookieService.get(UserService.SITEID_COOKIE)) {
          data = result.find(site => site.id === this.cookieService.get(UserService.SITEID_COOKIE));
        }
        if (!data) {
          data = result[0];
        }
        this.currentSiteSubject.next(data);
      });
    }
    return this.sites$;
  }

  getCurrentSite$(): Observable<SitesModel> {
    return this.currentSiteSubject;
  }

  setCurrentSite(site: SitesModel) {
    this.cookieService.set(UserService.SITEID_COOKIE, site.id);
    this.currentSiteSubject.next(site);
  }

  getSite(siteId: string): Observable<SitesModel> {
    if (!this.site$) {
      this.site$ = this.http.get(`/api/sites/${siteId}/users`);
    }
    return this.site$;
  }

  addUserToSite(email: string, siteId: string): Observable<any> {
    return this.http.post(`/api/sites/${siteId}/users/${email}`, null);
  }

  removeUserFromSite(email: string, siteId: string): Observable<any> {
    return this.http.delete(`/api/sites/${siteId}/users/${email}`, null);
  }
}
