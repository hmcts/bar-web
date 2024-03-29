import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SitesModel } from '../../models/sites.model';
import { SitesService } from '../../../shared/services/sites/sites.service';
import { map, filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../shared/services/user/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-site-admin',
  templateUrl: './site-admin.component.html',
  styleUrls: ['./site-admin.component.css'],
})
export class SiteAdminComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  userEmail: string;
  editMode = false;
  users$: Observable<Array<{email: string, forename: string, surname: string, roles: string}>>;
  siteId: string;
  serverFailure: string;
  courtName$ = of('...');
  deleteConfirmationOn = false;
  emailToDelete = '';

  constructor(
    private _sitesService: SitesService,
    private _cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.siteId = this._cookieService.get(UserService.SITEID_COOKIE);
    this.users$ = this._sitesService.getSite(this.siteId).pipe(map(site => site.siteUsers));
    this.courtName$ = this._sitesService.getSite(this.siteId).pipe(map(site => site.description
      .toLowerCase()
      .split(' ')
      .map(word => this.capitalize(word))
      .join(' '))
    );
  }

  onClickAddUser() {
    this.editMode = true;
  }
  onClickOpenIDAM() {
    const URL = 'https://idam-web-admin.platform.hmcts.net';
    window.open(URL, '_blank');
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
    this._sitesService.addUserToSite(this.userEmail, this.siteId).subscribe(() => {
      this.editMode = false;
      this.userEmail = null;
    }, err => {
      this.serverFailure = err.error.message;
    });
  }

  capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
