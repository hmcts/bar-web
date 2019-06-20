import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class HostBasedGuardService implements CanActivate {

  static INTERNAL_POSTFIX = 'localhost';

  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const onlyShowInternal = route.data.onlyShowInternal === undefined ? false : route.data.onlyShowInternal;
    const shouldShow = onlyShowInternal ? this.isInternalAddress() : true;
    if (shouldShow) {
      return true;
    } else {
      this._router.navigate(['error', 403]);
      return false;
    }
  }

  isInternalAddress() {
    return this.getHost().endsWith(HostBasedGuardService.INTERNAL_POSTFIX);
  }

  getHost(): string {
    const toIdx = window.location.host.lastIndexOf(':');
    if (toIdx > 0) {
      return window.location.host.substring(0, toIdx);
    } else {
      return window.location.host;
    }
  }
}
