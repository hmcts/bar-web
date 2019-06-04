import { HostBasedGuardService } from './host-based-guard.service';

describe('HostBasedGuardServiceTest', () => {
  let service: HostBasedGuardService;
  let mockActivatedRouteSnapshot: any;
  let routerSpy: any;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.callFake(url => {
      return url;
    });
    service = new HostBasedGuardService(routerSpy);
  });

  it('The url is internal so we accept to access the admin page', () => {
    mockActivatedRouteSnapshot = {
      data: {
        onlyShowInternal: true
      }
    };
    spyOn(service, 'getHost').and.returnValue('some.url.internal');
    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(true);
  });

  it('The url is external so we DON\'T accept to access the admin page', () => {
    mockActivatedRouteSnapshot = {
      data: {
        onlyShowInternal: true
      }
    };
    spyOn(service, 'getHost').and.returnValue('some.url.external');
    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(false);
  });

  it('turn of restriction so the page is accessible from now on', () => {
    mockActivatedRouteSnapshot = {
      data: {
        onlyShowInternal: false
      }
    };
    spyOn(service, 'getHost').and.returnValue('some.url.external');
    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(true);
  });

  it('if router data is not set up correctly we let everything to go', () => {
    mockActivatedRouteSnapshot = {
      data: { }
    };
    spyOn(service, 'getHost').and.returnValue('some.url.external');
    expect(service.canActivate(mockActivatedRouteSnapshot)).toBe(true);
  });

});

