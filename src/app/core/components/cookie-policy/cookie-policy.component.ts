import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']

})

export class CookiePolicyComponent implements OnInit {
    constructor(private _location: Location) {}

    // Ideally this would be an enum but angular can't seem to cope with enums in templates
    public readonly USAGE = 'Usage';
    public readonly INTRO = 'Intro';
    public readonly SESSION = 'Session';
    public readonly IDENTIFY = 'Identify';
    public readonly SECURITY = 'Security';
    public readonly GOOGLE = 'Google';
    public readonly DYNATRACE = 'Dynatrace';

    public cookieDetails =
      [
        {name: '_ga',
        cat: this.GOOGLE,
        purpose: 'This helps us count how many people visit the service by tracking if you’ve visited before',
        expires: '2 years'},
        {name: '_gat', cat: this.GOOGLE, purpose: 'Manages the rate at which page view requests are made', expires: '10 minutes'},
        {name: '_gid', cat: this.GOOGLE, purpose: 'Identifies you to the service', expires: '24 hours'},
        {name: 'dtCookie', cat: this.DYNATRACE, purpose: 'Tracks a visit across multiple request', expires: 'When session ends'},
        {name: 'dtLatC', cat: this.DYNATRACE, purpose: 'Measures server latency for performance monitoring', expires: 'When session ends'},
        {name: 'dtPC',
        cat: this.DYNATRACE,
        purpose: 'dtPC	Required to identify proper endpoints for beacon transmission; includes session ID for correlation',
        expires: 'When session ends'},
        {name: 'dtSa', cat: this.DYNATRACE, purpose: 'Intermediate store for page-spanning actions', expires: 'When session ends'},
        {name: 'rxVisitor', cat: this.DYNATRACE, purpose: 'Visitor ID to correlate sessions', expires: '1 year'},
        {name: 'rxvt', cat: this.DYNATRACE, purpose: 'Session timeout', expires: 'When session ends'},
        {name: 'bar-web-cookie-preferences', cat: this.SECURITY, purpose: 'Saves application preference information', expires: '1 year'},
        {name: '_oauth2_proxy', cat: this.SECURITY, purpose: 'Used to protect your login session', expires: '4 hours'},
        {name: '__user-info', cat: this.IDENTIFY, purpose: 'Your user Information', expires: 'When you close your browser'},
        {name: '__auth-token',
        cat: this.SECURITY,
        purpose: 'Information about your current system authorisations', expires: 'When you close your browser'},
        {name: 'ai_user', cat: this.USAGE, purpose: 'Generated user ID for usage tracking (Application Insights)', expires: '6 months'},
        {name: 'ai_session', cat: this.USAGE, purpose: 'Generated user session for usage tracking (Application Insights)', expires: '6 months'}
      ];


  ngOnInit(): void {}

  public countCookies(category: string): number {
    return this.cookiesByCat(category).length;
  }

  public cookiesByCat(category: string): {name: string, cat: string, purpose: string, expires: string}[] {
    return this.cookieDetails.filter(c => c.cat === category);
  }

  backClicked() {
    this._location.back();
  }
}

