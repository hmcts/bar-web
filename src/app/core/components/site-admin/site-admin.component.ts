import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SitesModel } from '../../models/sites.model';
import { SitesService } from '../../../shared/services/sites/sites.service';
import { map, filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../shared/services/user/user.service';
import { NgForm } from '@angular/forms';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { FeatureService } from '../../../shared/services/feature/feature.service';
import Feature from '../../../shared/models/feature.model';

@Component({
  selector: 'app-site-admin',
  templateUrl: './site-admin.component.html',
  styleUrls: ['./site-admin.component.css'],
})
export class SiteAdminComponent implements OnInit {

  static REGISTER_USER_UID = 'register-user-idam';
  @ViewChild('f') form: NgForm;
  userEmail: string;
  userFirstname: string;
  userLastname: string;
  editMode = false;
  users$: Observable<Array<{email: string, forename: string, surname: string}>>;
  siteId: string;
  serverFailure: string;
  courtName$ = of('...');
  deleteConfirmationOn = false;
  emailToDelete = '';
  roles = [
    {name: 'Post Clerk', value: 'bar-post-clerk'},
    {name: 'Fee Clerk', value: 'bar-fee-clerk'},
    {name: 'Senior Clerk', value: 'bar-senior-clerk'}
  ];
  selectedRole: string;
  registrationFeatureEnabled = false;

  constructor(
    private _sitesService: SitesService,
    private _cookieService: CookieService,
    private _userService: UserService,
    private _http: BarHttpClient,
    private _featureService: FeatureService
  ) { }

  ngOnInit(): void {
    const scope = this._cookieService.get(UserService.USER_SCOPE_COOKIE);
    this._featureService.findAllFeatures().subscribe(features => {
      const isFeatureOn = this.isRegistrationFeatureTurnedOn(features);
      this.registrationFeatureEnabled = isFeatureOn;
      if (!scope && isFeatureOn) {
        this._http.get('/api/invalidate-token').subscribe(resp => {
          this._userService.logOut();
          this._cookieService.set(UserService.USER_SCOPE_COOKIE, 'create-user');
          this.setRedirect();
        });
      } else {
        this.siteId = this._cookieService.get(UserService.SITEID_COOKIE);
        this.users$ = this._sitesService.getSite(this.siteId).pipe(map(site => site.siteUsers));
        this.courtName$ = this._sitesService.getSite(this.siteId).pipe(map(site => site.description
          .toLowerCase()
          .split(' ')
          .map(word => this.capitalize(word))
          .join(' '))
        );
      }
    });
  }

  setRedirect() {
    window.location.href = '/user-admin';
  }

  onClickAddUser() {
    this.editMode = true;
  }

  onClickCancel() {
    this.editMode = false;
    this.userEmail = null;
  }

  onClickDelete(email: string) {
    this.deleteConfirmationOn = true;
    this.emailToDelete = email;
  }

  deleteUserFromSite(email: string) {
    this.hideDeleteModal();
    this._sitesService.removeUserFromSite(email, this.siteId).subscribe(() => {
      this.users$ = this._sitesService.getSite(this.siteId).pipe(map(site => site.siteUsers));
    });
  }

  hideDeleteModal() {
    this.deleteConfirmationOn = !this.deleteConfirmationOn;
    this.emailToDelete = '';
  }

  onFormSubmission(event) {
    this.serverFailure = null;
    const user = {
      email: this.userEmail,
      firstName: this.userFirstname,
      lastName: this.userLastname,
      roles: [this.selectedRole]
    };
    this._sitesService.addUserToSite(user, this.siteId).subscribe(() => {
      this.editMode = false;
      this.userEmail = null;
    }, err => {
      this.serverFailure = err.error.message;
    });
  }

  capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  isRegistrationFeatureTurnedOn(features: Feature[]) {
    const regFeature = features.find(feature => feature.uid === SiteAdminComponent.REGISTER_USER_UID);
    return regFeature ? regFeature.enable : false;
  }
}
